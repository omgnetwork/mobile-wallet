import { Plasma, web3 } from 'common/clients'
import { Gas } from 'common/constants'
import { Mapper } from 'common/utils'
import BN from 'bn.js'
import {
  Contract,
  Transaction,
  OmgUtil,
  Utxos,
  TxDetails,
  Ethereum,
  Wait
} from 'common/blockchain'

export const getBalances = address => {
  return Plasma.ChildChain.getBalance(address).then(balances => {
    return balances.map(Mapper.mapChildchainAmount)
  })
}

export const transfer = async ({
  addresses,
  smallestUnitAmount,
  privateKey,
  gasOptions
}) => {
  const { from, to } = addresses
  const { amount, token } = smallestUnitAmount
  const { gasToken, gasPrice } = gasOptions
  const fee = Transaction.createFee(gasToken.contractAddress, gasPrice)
  const payment = Transaction.createPayment(to, token.contractAddress, amount)
  const utxos = await Utxos.get(from, {
    sort: (a, b) => new BN(b.amount).sub(new BN(a.amount))
  })
  const txBody = Transaction.createBody(from, utxos, [payment], fee)
  const typedData = Transaction.getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(privateKey)
  const signatures = Transaction.sign(typedData, privateKeys)
  const signedTxn = Transaction.buildSigned(typedData, signatures)
  return Transaction.submit(signedTxn)
}

export const deposit = async sendTransactionParams => {
  const txDetails = await TxDetails.getDeposit(sendTransactionParams)
  return Ethereum.signSendTx(txDetails, sendTransactionParams.privateKey)
}

export const mergeListOfUtxos = async (
  address,
  privateKey,
  maximumUtxosPerCurrency = 4,
  listOfUtxos,
  updateBlknumCallback = () => {}
) => {
  const pendingMergeUtxos = listOfUtxos.map(utxos =>
    Utxos.mergeUntilThreshold(
      address,
      privateKey,
      maximumUtxosPerCurrency,
      utxos,
      updateBlknumCallback
    )
  )
  return Promise.all(pendingMergeUtxos)
}

export const standardExit = async sendTransactionParams => {
  const txDetails = await TxDetails.getExit(sendTransactionParams)
  const { privateKey } = sendTransactionParams
  return Ethereum.signSendTx(txDetails, privateKey)
}

export const getStandardExitBond = async () => {
  try {
    const { bonds } = await Contract.getPaymentExitGame()
    return bonds.standardExit.toString()
  } catch (e) {
    return '14000000000000000'
  }
}

export const getErrorReason = async hash => {
  try {
    return await OmgUtil.ethErrorReason({ web3, hash })
  } catch (e) {
    console.log(e)
    return 'Cannot retrieve error reason'
  }
}

export const exit = async sendTransactionParams => {
  const { addresses, smallestUnitAmount } = sendTransactionParams
  const { blknum } = await Utxos.split(sendTransactionParams)
  const { from } = addresses
  const { token } = smallestUnitAmount

  await Wait.waitChildChainBlknum(from, blknum)

  const utxoToExit = await Utxos.get(from, {
    currency: token.contractAddress
  }).then(latestUtxos => latestUtxos.find(utxo => utxo.blknum === blknum))

  console.log('utxoToExit', utxoToExit)

  sendTransactionParams.smallestUnitAmount.utxo = utxoToExit

  const { hash } = await standardExit(sendTransactionParams)
  const exitId = await getStandardExitId(sendTransactionParams)

  return {
    hash,
    exitId,
    blknum: utxoToExit.blknum
  }
}

export const getStandardExitId = async ({ smallestUnitAmount }) => {
  const { utxo } = smallestUnitAmount
  const exitData = await Plasma.ChildChain.getExitData(utxo)
  return Plasma.RootChain.getStandardExitId({
    txBytes: exitData.txbytes,
    utxoPos: exitData.utxo_pos,
    isDeposit: utxo.blknum % 1000 !== 0
  })
}

export const getExitTime = (exitRequestBlockNumber, submissionBlockNumber) => {
  return Plasma.RootChain.getExitTime({
    exitRequestBlockNumber,
    submissionBlockNumber
  })
}

export const processExits = (contractAddress, maxExitsToProcess, txOptions) => {
  return Plasma.RootChain.processExits({
    token: contractAddress,
    exitId: 0,
    maxExitsToProcess: parseInt(maxExitsToProcess, 10),
    txOptions
  })
}

export const getExitQueue = async tokenContractAddress => {
  const queue = await Plasma.RootChain.getExitQueue(tokenContractAddress)
  return {
    tokenContractAddress,
    queue: queue.map(q => ({
      ...q,
      tokenContractAddress
    }))
  }
}

export const getFees = () => {
  return Plasma.ChildChain.getFees().then(response => {
    return response['1']
  })
}
