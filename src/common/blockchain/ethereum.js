import { ethers } from 'ethers'
import { Parser } from 'common/utils'
import { Gas } from 'common/constants/'
import axios from 'axios'
import Config from 'react-native-config'

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
  return wallet.sendTransaction({
    to: toAddress,
    value: Parser.parseUnits(token.balance, 'ether'),
    gasLimit: Gas.LOW_LIMIT,
    gasPrice: Parser.parseUnits(fee.amount, 'wei')
  })
}

export const sendErc20Token = (contract, options) => {
  const { fee, token, toAddress } = options

  const amount = Parser.parseUnits(token.balance, token.numberOfDecimals)

  const gasOptions = {
    gasLimit: Gas.LOW_LIMIT,
    gasPrice: Parser.parseUnits(fee.amount, 'wei')
  }

  return contract.transfer(toAddress, amount, gasOptions)
}

export const getContract = (tokenContractAddress, abi, walletOrProvider) => {
  return new ethers.Contract(tokenContractAddress, abi, walletOrProvider)
}

export const subscribeTx = (provider, tx, confirmations) => {
  return provider.waitForTransaction(tx.hash, confirmations)
}

export const createProvider = providerName => {
  return ethers.getDefaultProvider(providerName)
}
