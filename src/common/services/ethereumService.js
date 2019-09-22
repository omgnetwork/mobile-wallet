import { Ethereum } from 'common/blockchain'

export const sendErc20Token = (token, fee, fromWallet, toAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethereum.sendErc20Token(
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
      const pendingTransaction = await Ethereum.sendEthToken(
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
      const txReceipt = await Ethereum.subscribeTx(provider, tx, confirmations)
      resolve(txReceipt)
    } catch (err) {
      reject(err)
    }
  })
}

export const getResolvedPendingTxs = (pendingTxs, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Ethereum.getTxs(address)
      const transactions = response.data.result
      console.log(transactions)
      resolve(
        transactions.filter(
          tx =>
            pendingTxs.find(pendingTx => pendingTx.hash === tx.hash) !==
            undefined
        )
      )
    } catch (err) {
      reject(err)
    }
  })
}
