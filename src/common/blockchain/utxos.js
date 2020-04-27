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

export const getRequiredMerge = async (
  address,
  unsubmittedBlknum,
  maximumUtxosPerCurrency = 4
) => {
  if (unsubmittedBlknum) {
    await Wait.waitChildChainBlknum(address, unsubmittedBlknum)
  }

  const groupByCurrency = utxos => {
    return utxos.reduce((acc, utxo) => {
      const { currency } = utxo
      if (!acc[currency]) {
        acc[currency] = []
      }
      acc[currency].push(utxo)
      return acc
    }, {})
  }

  const filterOnlyGreaterThanMinimum = utxosMap => {
    return Object.keys(utxosMap)
      .filter(key => utxosMap[key].length > maximumUtxosPerCurrency)
      .map(key => utxosMap[key])
  }

  return get(address)
    .then(groupByCurrency)
    .then(filterOnlyGreaterThanMinimum)
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
  storeBlknum
) => {
  if (utxos.length <= maximumUtxosPerCurrency) {
    const blknum = utxos[0].blknum
    return {
      blknum,
      utxos
    }
  }

  let listOfUtxosGroup = []
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

  // Store blknum to the local storage.
  storeBlknum(blknum, utxos)

  await Wait.waitChildChainBlknum(address, blknum)
  let newUtxos = await get(address, {
    currency: utxos[0].currency
  })
  return await mergeUntilThreshold(
    address,
    privateKey,
    maximumUtxosPerCurrency,
    newUtxos,
    storeBlknum
  )
}

export const split = (address, privateKey, utxo, amount, fee) => {
  const _metadata = 'Split UTXOs'
  const fromUtxo = { ...utxo, amount: utxo.amount.toString() }
  const { currency } = fromUtxo
  const payment = Transaction.createPayment(address, currency, amount)
  const payments = new Array(3).fill(payment)
  const txBody = Transaction.createBody(
    address,
    [fromUtxo],
    payments,
    fee,
    _metadata
  )
  const typedData = Transaction.getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(privateKey)
  const signatures = Transaction.sign(typedData, privateKeys)
  const signedTxn = Transaction.buildSigned(typedData, signatures)
  return Transaction.submit(signedTxn)
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
  const amount = Math.pow(10, rounds)

  const candidateUtxos = utxos.filter(utxo => utxo.amount >= amount)
  const splittedUtxos = candidateUtxos.map(utxo => {
    return split(address, privateKey, utxo, amount / 10, fee)
  })
  console.log('Round', rounds)
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
