import { ethers } from 'ethers'
import { walletStorage } from '../storages/index'

// Returns a wallet
export const createWallet = () => {
  return ethers.Wallet.createRandom()
}

// Returns  a wallet
export const importMnemonic = mnemonic => {
  return ethers.Wallet.fromMnemonic(mnemonic)
}

// Get a wallet instance by address
export const getWallet = async address => {
  const privateKey = await walletStorage.getWalletPrivateKey(address)
  return new ethers.Wallet(privateKey)
}

// Format wei (big decimal) into eth string
export const formatEther = wei => {
  const ether = ethers.utils.formatEther(wei)
  return ether
}

export const createProvider = providerName => {
  const API_KEY = 'VCKWHFAA6M5AR8SFVXC43DEMEA8JN2H3WZ'
  return new ethers.providers.EtherscanProvider(
    providerName || 'rinkeby',
    API_KEY
  )
}
