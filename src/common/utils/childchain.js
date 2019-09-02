import { ChildChain, RootChain, OmgUtil } from '@omisego/omg-js'
import Config from 'react-native-config'
import * as ABI from './abi'
import Web3 from 'web3'

const { transaction } = OmgUtil

const web3 = new Web3(
  new Web3.providers.HttpProvider(Config.WEB3_HTTP_PROVIDER),
  null,
  {
    transactionConfirmationBlocks: 1
  }
)
const rootchain = new RootChain(web3, Config.CHILDCHAIN_CONTRACT_ADDRESS)
const childchain = new ChildChain(Config.CHILDCHAIN_WATCHER_URL)

export const getBalances = address => {
  return childchain.getBalance(address)
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
  currency: transaction.ETH_CURRENCY,
  amount: Number(amount)
})

export const createTransaction = (fromAddress, payments, fee) => {
  return childchain.createTransaction(
    fromAddress,
    payments,
    fee,
    transaction.NULL_METADATA
  )
}

export const getTypedData = tx => {
  return transaction.getTypedData(tx, Config.CHILDCHAIN_CONTRACT_ADDRESS)
}

export const signTransaction = (typedData, privateKey) => {
  return childchain.signTransaction(typedData, [privateKey])
}

export const buildSignedTransaction = (typedData, signatures) => {
  return childchain.buildSignedTransaction(typedData, signatures)
}

export const submitTransaction = signedTx => {
  return childchain.submitTransaction(signedTx)
}

export const depositEth = (address, privateKey, weiAmount, options) => {
  const depositTransaction = transaction.encodeDeposit(
    address,
    weiAmount,
    transaction.ETH_CURRENCY
  )

  const txOptions = {
    from: address,
    privateKey,
    ...options
  }

  return rootchain.depositEth(depositTransaction, weiAmount, txOptions)
}

export const depositErc20 = async (
  address,
  privateKey,
  weiAmount,
  contractAddress,
  options
) => {
  const erc20Contract = new web3.eth.Contract(ABI.erc20Abi(), contractAddress)

  const nonce = await web3.eth.getTransactionCount(address)

  const txDetails = {
    from: address,
    to: contractAddress,
    nonce: nonce,
    data: erc20Contract.methods
      .approve(Config.CHILDCHAIN_CONTRACT_ADDRESS, weiAmount)
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

  const depositTransaction = transaction.encodeDeposit(
    address,
    weiAmount,
    contractAddress
  )

  const txOptions = {
    from: address,
    privateKey
  }

  return rootchain.depositToken(depositTransaction, txOptions)
}
