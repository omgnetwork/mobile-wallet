import { Plasma } from 'common/clients'
import { ABI, Transaction, Parser, Formatter } from 'common/utils'
import { ContractAddress, Gas } from 'common/constants'
import { TxOptions } from 'common/blockchain'

export const getBalances = address => {
  return Plasma.childchain.getBalance(address)
}

export const getUtxos = (address, options) => {
  const { currency, lastUtxoPos } = options || {}

  return Plasma.childchain
    .getUtxos(address)
    .then(utxos =>
      currency ? utxos.filter(utxo => utxo.currency === currency) : utxos
    )
    .then(utxos =>
      utxos.filter(utxo => utxo.utxo_pos.toString(10) > (lastUtxoPos || 0))
    )
    .then(utxos => utxos.sort((a, b) => b.utxo_pos - a.utxo_pos))
}

export const createPayment = (address, tokenContractAddress, amount) => {
  return [
    {
      owner: address,
      currency: tokenContractAddress,
      amount: Number(amount)
    }
  ]
}

export const createFee = amount => ({
  currency: Plasma.transaction.ETH_CURRENCY,
  amount: Number(amount)
})

export const depositEth = async (
  address,
  privateKey,
  weiAmount,
  options = {}
) => {
  const web3 = Plasma.rootchain.web3
  const defaultGasPrice = await web3.eth.getGasPrice()
  const depositGas = options.gas || Gas.LIMIT
  const depositGasPrice = options.gasPrice || defaultGasPrice

  const encodedDepositTx = Plasma.transaction.encodeDeposit(
    address,
    weiAmount,
    Plasma.transaction.ETH_CURRENCY
  )

  const depositOptions = TxOptions.createDepositOptions(
    address,
    privateKey,
    depositGas,
    depositGasPrice
  )

  const receipt = await Plasma.rootchain.depositEth(
    encodedDepositTx,
    weiAmount,
    depositOptions
  )
  console.log('receipt', receipt)

  return receiptWithGasPrice(receipt, depositGasPrice)
}

export const depositErc20 = async (
  address,
  privateKey,
  weiAmount,
  tokenContractAddress,
  options = {}
) => {
  const web3 = Plasma.rootchain.web3
  const erc20VaultAddress = await Plasma.rootchain.getErc20VaultAddress()
  const erc20Contract = new web3.eth.Contract(
    ABI.erc20Abi(),
    tokenContractAddress
  )
  const defaultGasPrice = await web3.eth.getGasPrice()
  const depositGas = options.gas || Gas.LIMIT
  const depositGasPrice = options.gasPrice || defaultGasPrice

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

  await approveErc20(web3, approveOptions, privateKey)

  // SEND DEPOSIT TRANSACTION 👇

  const encodedDepositTx = Plasma.transaction.encodeDeposit(
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

  const receipt = await Plasma.rootchain.depositToken(
    encodedDepositTx,
    depositOptions
  )

  return receiptWithGasPrice(receipt, depositGasPrice)
}

const approveErc20 = async (web3, approveOptions, ownerPrivateKey) => {
  const signedApproveTx = await web3.eth.accounts.signTransaction(
    approveOptions,
    ownerPrivateKey
  )

  return web3.eth.sendSignedTransaction(signedApproveTx.rawTransaction)
}

const receiptWithGasPrice = (txReceipt, gasPrice) => {
  return {
    transactionHash: txReceipt.transactionHash,
    from: txReceipt.from,
    to: txReceipt.to,
    blockNumber: txReceipt.blockNumber,
    blockHash: txReceipt.blockHash,
    gasUsed: txReceipt.gasUsed,
    gasPrice: gasPrice
  }
}

// Exit
export const standardExit = async (exitData, blockchainWallet, options) => {
  return Plasma.rootchain.startStandardExit(
    exitData.utxo_pos,
    exitData.txbytes,
    exitData.proof,
    {
      privateKey: blockchainWallet.privateKey,
      from: blockchainWallet.address,
      gas: options.gasLimit || Gas.LIMIT
    }
  )
}

export const unlockTokenExitable = async (tokenContractAddress, options) => {
  try {
    if (tokenContractAddress === ContractAddress.ETH_ADDRESS)
      return Promise.resolve(true)
    const receipt = await Plasma.rootchain.addToken(
      tokenContractAddress,
      options
    )
    return Promise.resolve(receipt)
  } catch (err) {
    return Promise.resolve(true)
  }
}

export const processExits = (contractAddress, exitId, options) => {
  return Plasma.rootchain.processExits(contractAddress, exitId || 0, 1, options)
}

// Transaction management
export const createTx = (fromAddress, payments, fee, metadata) => {
  const encodedMetadata =
    (metadata && Transaction.encodeMetadata(metadata)) ||
    Plasma.transaction.NULL_METADATA

  return Plasma.childchain.createTransaction(
    fromAddress,
    payments,
    fee,
    encodedMetadata
  )
}

export const getTypedData = tx => {
  return Plasma.transaction.getTypedData(
    tx,
    Plasma.rootchain.plasmaContractAddress
  )
}

export const getExitData = utxo => {
  return Plasma.childchain.getExitData(utxo)
}

export const signTx = (typedData, privateKey) => {
  return Plasma.childchain.signTransaction(typedData, [privateKey])
}

export const buildSignedTx = (typedData, signatures) => {
  return Plasma.childchain.buildSignedTransaction(typedData, signatures)
}

export const submitTx = signedTx => {
  return Plasma.childchain.submitTransaction(signedTx)
}

export const getTxs = (address, options) => {
  const { blknum, limit } = options || { blknum: '0', limit: 10 }
  return Plasma.childchain.getTransactions({
    address: address,
    limit: limit || 10,
    page: 1
  })
}

export const getTx = transactionHash => {
  return Plasma.childchain.getTransaction(transactionHash)
}
