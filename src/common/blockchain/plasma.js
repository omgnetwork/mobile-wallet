import { Plasma, web3 } from 'common/clients'
import { Gas } from 'common/constants'
import { Mapper, Unit } from 'common/utils'
import BN from 'bn.js'
import {
  Contract,
  Transaction,
  OmgUtil,
  Utxos,
  GasEstimator,
  TxDetails,
  Ethereum
} from 'common/blockchain'

export const getBalances = address => {
  return Plasma.ChildChain.getBalance(address).then(balances => {
    return balances.map(Mapper.mapChildchainAmount)
  })
}

export const transfer = async (
  fromBlockchainWallet,
  toAddress,
  token,
  fee,
  metadata
) => {
  const payment = Transaction.createPayment(
    toAddress,
    token.contractAddress,
    Unit.convertToString(token.balance, 0, token.tokenDecimal, 16)
  )
  const childchainFee = Transaction.createFee(fee.contractAddress, fee.amount)
  const { address } = fromBlockchainWallet
  const utxos = await Utxos.get(address, {
    sort: (a, b) => new BN(b.amount).sub(new BN(a.amount))
  })
  const txBody = Transaction.createBody(
    address,
    utxos,
    [payment],
    childchainFee,
    metadata
  )

  const typedData = Transaction.getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(
    fromBlockchainWallet.privateKey
  )
  const signatures = Transaction.sign(typedData, privateKeys)
  const signedTxn = Transaction.buildSigned(typedData, signatures)
  return Transaction.submit(signedTxn)
}

export const deposit = async (
  address,
  privateKey,
  weiAmount,
  tokenContractAddress,
  options = {}
) => {
  const { gas, gasPrice } = options

  const txDetails = await TxDetails.getDeposit(
    tokenContractAddress,
    address,
    weiAmount,
    gas,
    gasPrice
  )

  return Ethereum.signSendTx(txDetails, privateKey)
}

export const mergeListOfUtxos = async (
  address,
  privateKey,
  maximumUtxosPerCurrency = 4,
  listOfUtxos,
  storeBlknum = () => {}
) => {
  const pendingMergeUtxos = listOfUtxos.map(utxos =>
    Utxos.mergeUntilThreshold(
      address,
      privateKey,
      maximumUtxosPerCurrency,
      utxos,
      storeBlknum
    )
  )
  return Promise.all(pendingMergeUtxos)
}

export const standardExit = (exitData, blockchainWallet, options) => {
  return Plasma.RootChain.startStandardExit({
    utxoPos: exitData.utxo_pos,
    outputTx: exitData.txbytes,
    inclusionProof: exitData.proof,
    txOptions: {
      privateKey: blockchainWallet.privateKey,
      from: blockchainWallet.address,
      gasPrice: options.gasPrice || Gas.EXIT_GAS_PRICE
    }
  })
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

export const getStandardExitId = (utxoToExit, exitData) => {
  return Plasma.RootChain.getStandardExitId({
    txBytes: exitData.txbytes,
    utxoPos: exitData.utxo_pos,
    isDeposit: utxoToExit.blknum % 1000 !== 0
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

export const getExitData = utxo => {
  const { amount, blknum, currency, oindex, owner, txindex, utxo_pos } = utxo
  const params = {
    amount,
    blknum,
    currency,
    oindex,
    owner,
    txindex,
    utxo_pos
  }
  return Plasma.ChildChain.getExitData(params)
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
