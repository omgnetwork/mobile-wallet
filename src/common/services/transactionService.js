import { Ethers } from '../utils'

export const sendErc20Token = (token, fee, fromWallet, toAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethers.sendErc20Token(
        token,
        fee,
        fromWallet,
        toAddress
      )
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const sendEthToken = (token, fee, fromWallet, toAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethers.sendEthToken(
        token,
        fee,
        fromWallet,
        toAddress
      )
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const subscribeTransaction = (provider, tx) => {
  return new Promise(async (resolve, reject) => {
    try {
      const txReceipt = await Ethers.subscribeTransaction(provider, tx)
      resolve(txReceipt)
    } catch (err) {
      reject(err)
    }
  })
}
