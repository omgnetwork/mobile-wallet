import 'ethers/dist/shims.js'
import { ethers } from 'ethers'
import axios from 'axios'

// Returns a wallet
export const createWallet = () => {
  return ethers.Wallet.createRandom()
}

export const createProvider = providerName => {
  const API_KEY = 'VCKWHFAA6M5AR8SFVXC43DEMEA8JN2H3WZ'
  return new ethers.providers.EtherscanProvider(providerName, API_KEY)
}

// Returns  a wallet
export const importWalletByMnemonic = mnemonic => {
  return ethers.Wallet.fromMnemonic(mnemonic)
}

// Get a wallet instance by privateKey
export const importWalletByPrivateKey = privateKey => {
  return new ethers.Wallet(privateKey)
}

// Format wei (big decimal) into eth string
export const formatEther = wei => {
  return ethers.utils.formatEther(wei)
}

export const getTransactionHistory = (etherscanProvider, address) => {
  return etherscanProvider.getHistory(address)
}

export const fetchTransactionDetail = address => {
  return axios.get('http://api-rinkeby.etherscan.io/api/', {
    params: {
      module: 'account',
      sort: 'asc',
      apikey: 'VCKWHFAA6M5AR8SFVXC43DEMEA8JN2H3WZ',
      address: address,
      action: 'tokentx'
    }
  })
}

export const getTokenBalance = (provider, contractAddress, accountAddress) => {
  const abi = [
    {
      constant: true,
      inputs: [
        {
          name: '_owner',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      type: 'function'
    }
  ]

  const contract = new ethers.Contract(contractAddress, abi, provider)
  return contract.balanceOf(accountAddress)
}

export const formatUnits = (amount, numberOfDecimals) => {
  return ethers.utils.formatUnits(amount, numberOfDecimals)
}

export const getTransactionReceipt = (provider, tx) => {
  return provider.getTransactionReceipt(tx.hash)
}

export const bignumberToString = bignumber => {
  return ethers.utils.bigNumberify(bignumber).toString()
}
