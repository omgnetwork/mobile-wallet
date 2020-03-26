import { Plasma } from 'common/blockchain'
import { PlasmaUtils } from 'common/clients'
import { Transaction, Wait } from 'common/utils'

export const split = (address, privateKey, utxo, amount) => {
  const _metadata = 'Split UTXOs'
  const fromUtxo = { ...utxo, amount: utxo.amount.toString() }
  const { currency } = fromUtxo
  const payment = Plasma.createPayment(address, currency, amount)[0]
  const payments = new Array(3).fill(payment)
  const fee = { ...Plasma.createFee(), amount: 1 }
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

// Return list of pending arrays
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
  console.log('Splitted')
  const { blknum } = receipts.sort((a, b) => b.blknum - a.blknum)[0]
  await Wait.waitChildChainBlknum(address, blknum)
  console.log('Finish round', rounds)
  return await splitUntilRoundZero(address, currency, privateKey, rounds - 1)
}
