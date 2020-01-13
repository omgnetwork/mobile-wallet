import { Plasma, PlasmaUtils, web3 } from 'common/clients'
import { ContractABI, Transaction } from 'common/utils'
import { Gas } from 'common/constants'
import BN from 'bn.js'
import { TxOptions } from 'common/blockchain'

const mappingAmount = obj => ({
  ...obj,
  amount: obj.amount.toString(10)
})

export const getBalances = address => {
  return Plasma.ChildChain.getBalance(address).then(balances => {
    return balances.map(mappingAmount)
  })
}

export const getUtxos = (address, options) => {
  const { currency, fromUtxoPos } = options || {}
  const filteringCurrency = utxo => utxo.currency === currency
  const filteringFromUtxoPos = utxo => utxo.utxo_pos >= (fromUtxoPos || 0)
  const sortingUtxoPos = (first, second) => second.utxo_pos - first.utxo_pos

  return Plasma.ChildChain.getUtxos(address)
    .then(utxos => utxos.map(mappingAmount))
    .then(utxos => (currency ? utxos.filter(filteringCurrency) : utxos))
    .then(utxos => utxos.filter(filteringFromUtxoPos))
    .then(utxos => utxos.sort(sortingUtxoPos))
}

export const createPayment = (address, tokenContractAddress, amount) => {
  return [
    {
      owner: address,
      currency: tokenContractAddress,
      amount: new BN(amount)
    }
  ]
}

export const createFee = (
  amount,
  currency = PlasmaUtils.transaction.ETH_CURRENCY
) => ({
  currency: currency,
  amount: Number(amount)
})

export const depositEth = async (
  address,
  privateKey,
  weiAmount,
  options = {}
) => {
  const depositGas = options.gas || Gas.MEDIUM_LIMIT
  const depositGasPrice = options.gasPrice || Gas.DEPOSIT_GAS_PRICE

  const encodedDepositTx = PlasmaUtils.transaction.encodeDeposit(
    address,
    weiAmount,
    PlasmaUtils.transaction.ETH_CURRENCY
  )

  const depositOptions = TxOptions.createDepositOptions(
    address,
    privateKey,
    depositGas,
    depositGasPrice
  )

  const receipt = await Plasma.RootChain.depositEth({
    depositTx: encodedDepositTx,
    amount: weiAmount,
    txOptions: depositOptions
  })

  return receiptWithGasPrice(receipt, depositGasPrice)
}

export const depositErc20 = async (
  address,
  privateKey,
  weiAmount,
  tokenContractAddress,
  options = {}
) => {
  const { address: erc20VaultAddress } = await Plasma.RootChain.getErc20Vault()
  const erc20Contract = new web3.eth.Contract(
    ContractABI.erc20Abi(),
    tokenContractAddress
  )
  const depositGas = options.gas || Gas.MEDIUM_LIMIT
  const depositGasPrice = options.gasPrice || Gas.DEPOSIT_GAS_PRICE

  // SEND ERC20 APPROVAL TRANSACTION 👇

  const approveOptions = TxOptions.createApproveErc20Options(
    address,
    tokenContractAddress,
    erc20Contract,
    erc20VaultAddress,
    weiAmount,
    depositGas,
    depositGasPrice
  )

  const approveReceipt = await approveErc20(approveOptions, privateKey)

  console.log(approveReceipt)

  // SEND DEPOSIT TRANSACTION 👇

  const encodedDepositTx = PlasmaUtils.transaction.encodeDeposit(
    address,
    weiAmount,
    tokenContractAddress
  )

  const depositOptions = TxOptions.createDepositOptions(
    address,
    privateKey,
    depositGas,
    depositGasPrice
  )

  const receipt = await Plasma.RootChain.depositToken({
    depositTx: encodedDepositTx,
    txOptions: depositOptions
  })

  return receiptWithGasPrice(receipt, depositGasPrice, approveReceipt.gasUsed)
}

const approveErc20 = async (approveOptions, ownerPrivateKey) => {
  const signedApproveTx = await web3.eth.accounts.signTransaction(
    approveOptions,
    ownerPrivateKey
  )

  return web3.eth.sendSignedTransaction(signedApproveTx.rawTransaction)
}

const receiptWithGasPrice = (txReceipt, gasPrice, additionalGasUsed = 0) => {
  return {
    hash: txReceipt.transactionHash,
    from: txReceipt.from,
    to: txReceipt.to,
    blockNumber: txReceipt.blockNumber,
    blockHash: txReceipt.blockHash,
    gasUsed: txReceipt.gasUsed + additionalGasUsed,
    gasPrice: gasPrice
  }
}

export const standardExit = (exitData, blockchainWallet, options) => {
  return Plasma.RootChain.startStandardExit({
    utxoPos: exitData.utxo_pos,
    outputTx: exitData.txbytes,
    inclusionProof: exitData.proof,
    txOptions: {
      privateKey: blockchainWallet.privateKey,
      from: blockchainWallet.address,
      gas: options.gasLimit || Gas.HIGH_LIMIT,
      gasPrice: options.gasPrice || Gas.EXIT_GAS_PRICE
    }
  })
}

export const waitForRootchainTransaction = ({
  hash,
  intervalMs,
  confirmationThreshold,
  onCountdown = remaining => {}
}) => {
  return PlasmaUtils.waitForRootchainTransaction({
    web3,
    hash,
    checkIntervalMs: intervalMs,
    blocksToWait: confirmationThreshold,
    onCountdown: onCountdown
  })
}

export const getPaymentExitGameAddress = () => {
  return Plasma.RootChain.getPaymentExitGame()
}

export const getErrorReason = hash => {
  return PlasmaUtils.ethErrorReason({ web3, hash })
}

export const isDepositUtxo = utxo => {
  return utxo.blknum % 1000 !== 0
}

export const getStandardExitId = (utxoToExit, exitData) => {
  return Plasma.RootChain.getStandardExitId({
    txBytes: exitData.txbytes,
    utxoPos: exitData.utxo_pos,
    isDeposit: isDepositUtxo(utxoToExit)
  })
}

export const hasToken = tokenContractAddress => {
  return Plasma.RootChain.hasToken(tokenContractAddress)
}

export const addToken = async (tokenContractAddress, options) => {
  try {
    const receipt = await Plasma.RootChain.addToken({
      token: tokenContractAddress,
      txOptions: options
    })
    return Promise.resolve(receipt)
  } catch (err) {
    return Promise.reject(err)
  }
}

// We're not using this right now but let's keep it because it still has potential to be used in the future.
// export const processExits = (contractAddress, exitId, txOptions) => {
//   return Plasma.RootChain.processExits({
//     token: contractAddress,
//     exitId: exitId || 0,
//     maxExitsToProcess: 1,
//     txOptions
//   })
// }

// Transaction management
export const createTx = (fromAddress, payments, fee, metadata) => {
  const encodedMetadata =
    (metadata && Transaction.encodeMetadata(metadata)) ||
    PlasmaUtils.transaction.NULL_METADATA

  return Plasma.ChildChain.createTransaction({
    owner: fromAddress,
    payments,
    fee,
    metadata: encodedMetadata
  })
}

export const getTypedData = tx => {
  return PlasmaUtils.transaction.getTypedData(
    tx,
    Plasma.RootChain.plasmaContractAddress
  )
}

export const getExitData = utxo => {
  return Plasma.ChildChain.getExitData(utxo)
}

export const signTx = (typedData, privateKeys) => {
  return Plasma.ChildChain.signTransaction(typedData, privateKeys)
}

export const buildSignedTx = (typedData, signatures) => {
  return Plasma.ChildChain.buildSignedTransaction(typedData, signatures)
}

export const submitTx = signedTx => {
  return Plasma.ChildChain.submitTransaction(signedTx)
}

export const getTxs = (address, options) => {
  const { blknum, limit } = options || { blknum: '0', limit: 10 }
  return Plasma.ChildChain.getTransactions({
    address: address,
    limit: limit || 10,
    page: 1
  })
}

export const getTx = hash => {
  return Plasma.ChildChain.getTransaction(hash)
}
