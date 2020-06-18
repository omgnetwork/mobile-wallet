import { ethers } from 'ethers'
import { web3 } from 'common/clients'
import axios from 'axios'
import Config from 'react-native-config'
import { Unit } from 'common/utils'
import { TxDetails } from 'common/blockchain'
import { web3EstimateGas } from './gasEstimator'

export const importWalletMnemonic = mnemonic => {
  return ethers.Wallet.fromMnemonic(mnemonic)
}

// ethers.utils.HDNode.entropyToMnemonic is possible to return duplicated values.
// This function will make sure that the mnemonic will always has unique values.
export const generateWalletMnemonic = () => {
  let mnemonic, valid
  while (!valid) {
    mnemonic = ethers.utils.HDNode.entropyToMnemonic(
      ethers.utils.randomBytes(16)
    )
    const words = mnemonic.split(' ')
    const totalUniqueWords = new Set(words).size
    const totalWords = words.length
    if (totalUniqueWords === totalWords) {
      valid = true
    }
  }
  return mnemonic
}

export const importWalletPrivateKey = privateKey => {
  return new ethers.Wallet(privateKey)
}

// Transaction Management
export const getERC20Txs = (address, options) => {
  const { lastEthBlockNumber, limit, page } = options
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'desc',
      apikey: Config.ETHERSCAN_API_KEY,
      offset: limit || 0,
      page: page || 1,
      address: address,
      action: 'tokentx',
      startblock: lastEthBlockNumber || '0',
      endblock: '99999999'
    }
  })
}

export const getTxs = (address, options) => {
  const { lastEthBlockNumber, limit, page } = options
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'desc',
      apikey: Config.ETHERSCAN_API_KEY,
      address: address,
      offset: limit || 0,
      page: page || 1,
      action: 'txlist',
      startblock: lastEthBlockNumber || '0',
      endblock: '99999999'
    }
  })
}

export const getInternalTxs = (address, options) => {
  const { lastBlockNumber, limit, page } = options
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'desc',
      apikey: Config.ETHERSCAN_API_KEY,
      address: address,
      offset: limit || 0,
      page: page || 1,
      action: 'txlistinternal',
      startblock: lastBlockNumber || '0',
      endblock: '99999999'
    }
  })
}

export const sendEthToken = (wallet, options) => {
  const { fee, token, toAddress } = options
  const amount = Unit.convertToString(token.balance, 0, token.tokenDecimal)

  const txDetails = TxDetails.getTransferEth(
    wallet.address,
    toAddress,
    amount,
    fee
  )
  return signSendTx(txDetails, wallet.privateKey)
}

export const sendErc20Token = async (contract, options) => {
  const { fee, token, toAddress, wallet } = options
  const amount = Unit.convertToString(token.balance, 0, token.tokenDecimal)

  const txDetails = TxDetails.getTransferErc20(
    wallet.address,
    toAddress,
    amount,
    fee,
    contract
  )

  txDetails.gas = await web3EstimateGas(txDetails)
  return signSendTx(txDetails, wallet.privateKey)
}

export const getGasFromGasStation = () => {
  return axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(response => response.data)
}

export const getContract = (tokenContractAddress, abi) => {
  return new web3.eth.Contract(abi, tokenContractAddress)
}

export const createProvider = providerName => {
  return ethers.getDefaultProvider(providerName)
}

export const signSendTx = async (txDetails, privateKey) => {
  const signedTx = await web3.eth.accounts.signTransaction(
    txDetails,
    privateKey
  )

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
      if (error) return reject(error)
      return resolve({ hash })
    })
  })
}
