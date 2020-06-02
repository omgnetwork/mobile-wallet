import { ethers } from 'ethers'
import { BlockchainNetworkType } from 'common/constants'

export const isValidAddress = address => {
  try {
    ethers.utils.getAddress(address)
  } catch (e) {
    return false
  }
  return true
}

export const isValidAmount = amount => {
  try {
    const number = Number(amount.replace(',', '.'))
    return number > 0 && number !== 'NaN'
  } catch (e) {
    return false
  }
}

export const isValidMnemonic = mnemonic => {
  return ethers.utils.HDNode.isValidMnemonic(mnemonic)
}

export const isValidWalletName = name => {
  return !!name
}

export const isEnoughToken = (sendAmount, tokenAmount) => {
  try {
    const sendNumber = Number(sendAmount.replace(',', '.'))
    const tokenNumber = Number(tokenAmount.replace(',', '.'))
    return sendNumber <= tokenNumber
  } catch (e) {
    return false
  }
}

export const isValidTransaction = transaction => {
  return transaction && transaction.from && transaction.to
}

export const isOmiseGOTransaction = transaction => {
  return transaction.network === BlockchainNetworkType.TYPE_OMISEGO_NETWORK
}
