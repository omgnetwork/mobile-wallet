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

export const isEnoughToken = (sendAmount, tokenAmount) => {
  return Number(sendAmount) <= Number(tokenAmount)
}

export const isValidTransaction = transaction => {
  return transaction && transaction.from && transaction.to
}

export const isOmiseGOTransaction = transaction => {
  return transaction.network === 'omisego'
}
