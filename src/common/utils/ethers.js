import { ethers } from 'ethers'

export const createWallet = () => {
  return ethers.Wallet.createRandom()
}
