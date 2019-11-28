import 'ethers/dist/shims.js'
import { ethers } from 'ethers'
import { Parser, ContractABI } from 'common/utils'
import { ContractAddress, Gas } from 'common/constants/'
import axios from 'axios'
import Config from 'react-native-config'

export const importWalletMnemonic = mnemonic => {
  return ethers.Wallet.fromMnemonic(mnemonic)
}

export const generateWalletMnemonic = () => {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
}

export const importWalletPrivateKey = privateKey => {
  return new ethers.Wallet(privateKey)
}

export const getEthBalance = address => {
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'asc',
      apikey: Config.ETHERSCAN_API_KEY,
      address: address,
      action: 'balance'
    }
  })
}

export const getERC20Balance = (provider, contractAddress, accountAddress) => {
  const abi = ContractABI.erc20Abi()
  const contract = new ethers.Contract(contractAddress, abi, provider)
  return contract.balanceOf(accountAddress)
}

export const getTokenDetail = (provider, contractAddress) => {
  const abi = ContractABI.erc20Abi()
  const contract = new ethers.Contract(contractAddress, abi, provider)
  if (contractAddress === ContractAddress.ETH_ADDRESS) {
    return [
      Promise.resolve('Ether'),
      Promise.resolve('ETH'),
      Promise.resolve(18),
      Promise.resolve(contractAddress)
    ]
  } else {
    return [
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      Promise.resolve(contractAddress)
    ]
  }
}

// Transaction Management
export const getERC20Txs = (address, options) => {
  const { lastBlockNumber, limit, page } = options
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'desc',
      apikey: Config.ETHERSCAN_API_KEY,
      offset: limit || 0,
      page: page || 1,
      address: address,
      action: 'tokentx',
      startblock: lastBlockNumber || '0',
      endblock: '99999999'
    }
  })
}

export const getTxs = (address, options) => {
  const { lastBlockNumber, limit, page } = options
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'desc',
      apikey: Config.ETHERSCAN_API_KEY,
      address: address,
      offset: limit || 0,
      page: page || 1,
      action: 'txlist',
      startblock: lastBlockNumber || '0',
      endblock: '99999999'
    }
  })
}

export const sendEthToken = (wallet, options) => {
  const { fee, token, toAddress } = options
  return wallet.sendTransaction({
    to: toAddress,
    value: ethers.utils.parseEther(token.balance),
    gasLimit: Gas.LIMIT,
    gasPrice: Parser.parseUnits(fee.amount, 'gwei')
  })
}

export const sendErc20Token = (wallet, options) => {
  const { fee, token, toAddress } = options
  const abi = ContractABI.erc20Abi()
  const contract = new ethers.Contract(token.contractAddress, abi, wallet)

  const numberOfTokens = Parser.parseUnits(
    token.balance,
    token.numberOfDecimals
  )

  const gasOptions = {
    gasLimit: Gas.LIMIT,
    gasPrice: Parser.parseUnits(fee.amount, 'gwei')
  }

  return contract.transfer(toAddress, numberOfTokens, gasOptions)
}

export const subscribeTx = (provider, tx, confirmations) => {
  return provider.waitForTransaction(tx.hash, confirmations)
}

export const createProvider = providerName => {
  return ethers.getDefaultProvider(providerName)
}
