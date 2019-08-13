import 'ethers/dist/shims.js'
import { ethers } from 'ethers'
import axios from 'axios'
import Config from 'react-native-config'

// Returns a wallet
export const createWallet = () => {
  return ethers.Wallet.createRandom()
}

// Create etherscan provider
export const createProvider = providerName => {
  return new ethers.providers.EtherscanProvider(
    providerName,
    Config.ETHERSCAN_API_KEY
  )
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
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'asc',
      apikey: Config.ETHERSCAN_API_KEY,
      address: address,
      action: 'tokentx'
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

// export const formatUnits = (amount, numberOfDecimals, maxDecimal, ellisize) => {
//   const formattedUnitAmount = ethers.utils.formatUnits(amount, numberOfDecimals)
//   const commifiedAmount = commify(formattedUnitAmount)
//   return formatDecimal(commifiedAmount, maxDecimal, ellisize)
// }

export const formatUnits = (amount, numberOfDecimals) => {
  return ethers.utils.formatUnits(amount, numberOfDecimals)
}

export const commify = amount => {
  return ethers.utils.commify(amount)
}

export const calculatePrice = (subunitAmount, numberOfDecimals, price) => {
  const divider = ethers.utils.bigNumberify(getDecimalDivider(numberOfDecimals))
  const bdUnitAmounts = ethers.utils.bigNumberify(subunitAmount).div(divider)
  const bdPrice = ethers.utils.bigNumberify(price)
  return bdUnitAmounts.mul(bdPrice)
}

const getDecimalDivider = numberOfDecimals => {
  return '1' + '0'.repeat(numberOfDecimals)
}

export const formatDecimal = (amount, maxDecimal, ellipsize) => {
  const [integer, decimal] = amount.split('.')
  if (decimal && decimal.length > maxDecimal) {
    return [
      integer,
      '.',
      decimal.substring(0, maxDecimal),
      ellipsize ? '...' : ''
    ].join('')
  }
  return amount
}

export const bigNumberify = amount => {
  return ethers.utils.bigNumberify(amount)
}

export const bignumberToString = number => {
  return bigNumberify(number).toString()
}
