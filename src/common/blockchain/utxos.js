import { Transaction, Wait } from 'common/blockchain'
import { Plasma as PlasmaClient } from 'common/clients'
import { Mapper } from 'common/utils'
import BN from 'bn.js'

export const get = (address, options) => {
  const { currency, fromUtxoPos, sort } = options || {}

  const filteringCurrency = utxo => utxo.currency === currency
  const filteringFromUtxoPos = utxo => utxo.utxo_pos >= (fromUtxoPos || 0)
  const sortingUtxoPos = (first, second) => second.utxo_pos - first.utxo_pos
  return PlasmaClient.ChildChain.getUtxos(address)
    .then(utxos => utxos.map(Mapper.mapChildchainAmount))
    .then(utxos => (currency ? utxos.filter(filteringCurrency) : utxos))
    .then(utxos => utxos.filter(filteringFromUtxoPos))
    .then(utxos => utxos.sort(sort || sortingUtxoPos))
}

export const mapByCurrency = utxos => {
  return utxos.reduce((acc, utxo) => {
    const { currency } = utxo
    if (!acc[currency]) {
      acc[currency] = []
    }
    acc[currency].push(utxo)
    return acc
  }, {})
}

export const filterOnlyGreaterThanMaximum = (
  utxosMap,
  maximumUtxosPerCurrency
) => {
  return Object.keys(utxosMap)
    .filter(key => utxosMap[key].length > maximumUtxosPerCurrency)
    .map(key => utxosMap[key])
}

export const sum = utxos => {
  return utxos.reduce((acc, utxo) => acc.add(new BN(utxo.amount)), new BN(0))
}

export const merge = async (address, privateKey, utxos) => {
  const _metadata = 'Merge UTXOs'
  const { currency } = utxos[0]
  const totalAmount = sum(utxos)
  const payment = Transaction.createPayment(address, currency, totalAmount)
  const fee = Transaction.createFee(currency, 0)
  const txBody = Transaction.createBody(
    address,
    utxos,
    [payment],
    fee,
    Transaction.encodeMetadata(_metadata)
  )
  const typedData = Transaction.getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(privateKey)
  const signatures = Transaction.sign(typedData, privateKeys)
  const signedTxn = Transaction.buildSigned(typedData, signatures)
  return Transaction.submit(signedTxn)
}

export const mergeUntilThreshold = async (
  address,
  privateKey,
  maximumUtxosPerCurrency,
  utxos,
  updateBlknumCallback
) => {
  if (utxos.length <= maximumUtxosPerCurrency) {
    const blknum = utxos[0].blknum
    return {
      blknum,
      utxos
    }
  }

  const listOfUtxosGroup = []
  let utxosGroup = []
  for (let i = 0; i < utxos.length; i++) {
    utxosGroup.push(utxos[i])
    if (
      utxosGroup.length === 4 ||
      (i === utxos.length - 1 && utxosGroup.length > 1)
    ) {
      listOfUtxosGroup.push(utxosGroup)
      utxosGroup = []
    }
  }

  const pendingTxs = listOfUtxosGroup.map(groupOfUtxos =>
    merge(address, privateKey, groupOfUtxos)
  )

  const receipts = await Promise.all(pendingTxs)
  const { blknum } = receipts.sort((a, b) => b.blknum - a.blknum)[0]

  updateBlknumCallback(blknum, utxos)

  await Wait.waitChildChainBlknum(address, blknum)
  const newUtxos = await get(address, {
    currency: utxos[0].currency
  })

  return await mergeUntilThreshold(
    address,
    privateKey,
    maximumUtxosPerCurrency,
    newUtxos,
    updateBlknumCallback
  )
}

export const split = ({
  addresses,
  privateKey,
  smallestUnitAmount,
  gasOptions
}) => {
  const { utxo, amount } = smallestUnitAmount
  const { from } = addresses
  const { feeUtxo, feeToken } = gasOptions

  const metadata = 'Split UTXOs'
  const fromUtxos =
    feeUtxo.currency === utxo.currency ? [utxo] : [utxo, feeUtxo]
  const payment = Transaction.createPayment(from, utxo.currency, amount)
  const fee = { amount: feeToken.amount, currency: feeToken.currency }
  const txBody = Transaction.createBody(
    from,
    fromUtxos,
    [payment],
    fee,
    metadata
  )
  const typedData = Transaction.getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(privateKey)
  const signatures = Transaction.sign(typedData, privateKeys)
  const signedTxn = Transaction.buildSigned(typedData, signatures)
  return Transaction.submit(signedTxn)
}
