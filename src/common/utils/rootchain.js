import 'ethers/dist/shims.js'
import { ethers } from 'ethers'
import * as Parser from './parser'
import * as ABI from './abi'
import axios from 'axios'
import Config from 'react-native-config'

export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

export const createProvider = providerName => {
  return new ethers.providers.EtherscanProvider(
    providerName,
    Config.ETHERSCAN_API_KEY
  )
}

export const importWalletByMnemonic = mnemonic => {
  return ethers.Wallet.fromMnemonic(mnemonic)
}

export const generateMnemonic = () => {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
}

export const importWalletByPrivateKey = privateKey => {
  return new ethers.Wallet(privateKey)
}

export const fetchTransactionDetail = (address, lastBlockNumber) => {
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'asc',
      apikey: Config.ETHERSCAN_API_KEY,
      address: address,
      action: 'tokentx',
      startblock: lastBlockNumber,
      endblock: '99999999'
    }
  })
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
export const getTokenBalance = (provider, contractAddress, accountAddress) => {
  const abi = ABI.erc20Abi()
  const contract = new ethers.Contract(contractAddress, abi, provider)
  return contract.balanceOf(accountAddress)
}

export const sendErc20Token = (token, fee, wallet, toAddress) => {
  const abi = ABI.erc20Abi()
  const contract = new ethers.Contract(token.contractAddress, abi, wallet)

  const numberOfTokens = Parser.parseUnits(
    token.balance,
    token.numberOfDecimals
  )

  const options = {
    gasLimit: Number(Config.ROOTCHAIN_GAS_LIMIT),
    gasPrice: Parser.parseUnits(fee.amount, 'gwei')
  }

  return contract.transfer(toAddress, numberOfTokens, options)
}

export const sendEthToken = (token, fee, wallet, toAddress) => {
  return wallet.sendTransaction({
    to: toAddress,
    value: ethers.utils.parseEther(token.balance),
    gasLimit: Number(Config.ROOTCHAIN_GAS_LIMIT),
    gasPrice: Parser.parseUnits(fee.amount, 'gwei')
  })
}

export const subscribeTransaction = (provider, tx, confirmations) => {
  return provider.waitForTransaction(tx.hash, confirmations)
}
