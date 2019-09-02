import { Rootchain } from '../utils'

export const sendErc20Token = (token, fee, fromWallet, toAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Rootchain.sendErc20Token(
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
      const pendingTransaction = await Rootchain.sendEthToken(
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

export const subscribeTransaction = (provider, tx, confirmations) => {
  return new Promise(async (resolve, reject) => {
    try {
      const txReceipt = await Rootchain.subscribeTransaction(
        provider,
        tx,
        confirmations
      )
      resolve(txReceipt)
    } catch (err) {
      reject(err)
    }
  })
}
