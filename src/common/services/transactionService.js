import { Ethers } from '../utils'

export const sendErc20Token = (token, fromWallet, toAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethers.sendErc20Token(
        token,
        fromWallet,
        toAddress
      )
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const sendEthToken = (token, fromWallet, toAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethers.sendEthToken(
        token,
        fromWallet,
        toAddress
      )
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const waitForTransaction = (provider, tx) => {
  return new Promise(async (resolve, reject) => {
    try {
      const txReceipt = await Ethers.waitForTransaction(provider, tx)
      resolve(txReceipt)
    } catch (err) {
      reject(err)
    }
  })
}
