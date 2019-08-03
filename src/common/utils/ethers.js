import { ethers } from 'ethers'

// Returns a wallet
export const createWallet = () => {
  return ethers.Wallet.createRandom()
}

// Returns  a wallet
export const importMnemonic = mnemonic => {
  return ethers.Wallet.fromMnemonic(mnemonic)
}
