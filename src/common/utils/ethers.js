import 'ethers/dist/shims.js'
import { ethers } from 'ethers'

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
