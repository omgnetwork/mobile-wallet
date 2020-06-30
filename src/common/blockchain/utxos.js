import { Transaction, Wait } from 'common/blockchain'
import { Plasma as PlasmaClient } from 'common/clients'
import { Mapper, Unit } from 'common/utils'
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

  console.log('feeUtxo', feeUtxo)

  const _metadata = 'Split UTXOs'
  const fromUtxos = [
    { ...utxo, amount: utxo.amount.toString() },
    {
      ...feeUtxo,
      amount: feeUtxo.amount.toString()
    }
  ]
  const payment = Transaction.createPayment(from, utxo.currency, amount)
  // const payments = new Array(3).fill(payment)
  console.log('fromUtxos', fromUtxos)
  const txBody = Transaction.createBody(
    from,
    fromUtxos,
    [payment],
    { amount: feeToken.amount, currency: feeToken.currency },
    _metadata
  )
  console.log('txBody', txBody)
  const typedData = Transaction.getTypedData(txBody)
  console.log('typeData', typedData)
  const privateKeys = new Array(txBody.inputs.length).fill(privateKey)
  console.log('privateKeys', privateKeys)
  try {
    const signatures = Transaction.sign(typedData, privateKeys)
    console.log('signatures', signatures)
    const signedTxn = Transaction.buildSigned(typedData, signatures)

    console.log('signedTx', signedTxn)
    return Transaction.submit(signedTxn)
  } catch (err) {
    console.error(err)
  }
}

// Recursively split the utxos for the given currency until the given round is zero
// For example, the address has 1 utxo with 10000 wei amount.
// Given rounds = 2, it will split the utxo as following:
// Round 2: [10000] -> [1000*4] (1000*4 is a short-handed for [600, 600, 600, 600])
// Round 1: [6000, 1000, 1000, 1000, 1000] -> [600*4, 100*4, 100*4, 100*4, 100*4]
// Round 0: Returns [600*4, 100*4, 100*4, 100*4, 100*4] (Total 20 UTXOs)
// Note: Cloudflare is starting to deny the request when rounds >= 7.
export const splitUntilRoundZero = async (
  address,
  currency,
  privateKey,
  rounds,
  fee
) => {
  const utxos = await get(address, {
    currency
  })

  if (rounds === 0) return utxos
  const amount = Math.pow(10, rounds) * fee.amount

  const candidateUtxos = utxos.filter(utxo => utxo.amount >= amount)
  const splittedUtxos = candidateUtxos.map(utxo => {
    return split(address, privateKey, utxo, fee.amount, fee)
  })
  console.log('Rounds left: ', rounds)
  const receipts = await Promise.all(splittedUtxos)
  const { blknum } = receipts.sort((a, b) => b.blknum - a.blknum)[0]
  console.log(`Splitted successfully. Waiting for block ${blknum}...`)
  await Wait.waitChildChainBlknum(address, blknum)
  return await splitUntilRoundZero(
    address,
    currency,
    privateKey,
    rounds - 1,
    fee
  )
}
