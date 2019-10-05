import { Plasma } from 'common/clients'
import { ABI, Transaction } from 'common/utils'

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

// Deposit
export const depositEth = (address, privateKey, weiAmount, options) => {
  const depositTransaction = Plasma.transaction.encodeDeposit(
    address,
    weiAmount,
    Plasma.transaction.ETH_CURRENCY
  )

  const txOptions = {
    from: address,
    privateKey,
    ...options
  }

  return Plasma.rootchain.depositEth(depositTransaction, weiAmount, txOptions)
}

export const depositErc20 = async (
  address,
  privateKey,
  weiAmount,
  contractAddress,
  options
) => {
  const web3 = Plasma.rootchain.web3
  const plasmaContractAddress = Plasma.rootchain.plasmaContractAddress
  const erc20Contract = new web3.eth.Contract(ABI.erc20Abi(), contractAddress)

  const nonce = await web3.eth.getTransactionCount(address)

  const txDetails = {
    from: address,
    to: contractAddress,
    nonce: nonce,
    data: erc20Contract.methods
      .approve(plasmaContractAddress, weiAmount)
      .encodeABI(),
    gasPrice: options.gasPrice
  }

  const gas = await web3.eth.estimateGas(txDetails)

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      ...txDetails,
      gas
    },
    privateKey
  )

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

  const depositTransaction = Plasma.transaction.encodeDeposit(
    address,
    weiAmount,
    contractAddress
  )

  const txOptions = {
    from: address,
    privateKey
  }

  return Plasma.rootchain.depositToken(depositTransaction, txOptions)
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
      gas: 1000000,
      gasPrice: 10000000000
    }
  )
}

export const unlockTokenExitable = async (tokenContractAddress, options) => {
  try {
    const receipt = await Plasma.rootchain.addToken(
      tokenContractAddress,
      options
    )
    return Promise.resolve(receipt)
  } catch (err) {
    return Promise.resolve(true)
  }
}

export const processExits = (contractAddress, options) => {
  return Plasma.rootchain.processExits(contractAddress, 0, 10, options)
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
  console.log(options)
  return Plasma.childchain.getTransactions({
    address: address,
    limit: limit || 10,
    page: 1
  })
}

export const getTx = transactionHash => {
  return Plasma.childchain.getTransaction(transactionHash)
}
