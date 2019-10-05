import 'ethers/dist/shims.js'
import { ethers } from 'ethers'

export const isValidAddress = address => {
  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    return false
  }
  return true
}

export const isValidAmount = amount => {
  const number = Number(amount)
  if (number > 0 && number !== 'NaN') {
    return true
  } else {
    return false
  }
}
