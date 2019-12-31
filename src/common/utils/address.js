import { ethers } from 'ethers'

export const isValidAddress = address => {
  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    return false
  }
  return true
}
