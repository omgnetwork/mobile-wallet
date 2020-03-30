import { Plasma } from 'common/blockchain'
import { PlasmaUtils } from 'common/clients'
import { Transaction, Wait } from 'common/utils'

export const split = (address, privateKey, utxo, amount) => {
  const _metadata = 'Split UTXOs'
  const fromUtxo = { ...utxo, amount: utxo.amount.toString() }
  const { currency } = fromUtxo
  const payment = Plasma.createPayment(address, currency, amount)[0]
  const payments = new Array(3).fill(payment)
  const fee = Plasma.createFee(currency, 1)
  const txBody = PlasmaUtils.transaction.createTransactionBody({
    fromAddress: address,
    fromUtxos: [fromUtxo],
    payments,
    fee,
    metadata: Transaction.encodeMetadata(_metadata)
  })
  const typedData = Plasma.getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(privateKey)
  const signatures = Plasma.signTx(typedData, privateKeys)
  const signedTxn = Plasma.buildSignedTx(typedData, signatures)
  return Plasma.submitTx(signedTxn)
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
  rounds
) => {
  const utxos = await Plasma.getUtxos(address, {
    currency
  })

  if (rounds === 0) return utxos
  const amount = Math.pow(10, rounds)

  const candidateUtxos = utxos.filter(utxo => utxo.amount >= amount)
  const splittedUtxos = candidateUtxos.map(utxo => {
    return split(address, privateKey, utxo, amount / 10)
  })
  console.log('Round', rounds)
  const receipts = await Promise.all(splittedUtxos)
  const { blknum } = receipts.sort((a, b) => b.blknum - a.blknum)[0]
  console.log(`Splitted successfully. Waiting for block ${blknum}...`)
  await Wait.waitChildChainBlknum(address, blknum)
  return await splitUntilRoundZero(address, currency, privateKey, rounds - 1)
}
