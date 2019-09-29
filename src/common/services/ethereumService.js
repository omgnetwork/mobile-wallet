import { Ethereum } from 'common/blockchain'

export const sendErc20Token = (wallet, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethereum.sendErc20Token(wallet, options)
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const sendEthToken = (wallet, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethereum.sendEthToken(wallet, options)
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const getERC20Txs = (address, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Ethereum.getERC20Txs(address, options)
      const currentRootchainTxs = response.data.result
      resolve(currentRootchainTxs)
    } catch (err) {
      reject(err)
    }
  })
}

export const getTxs = (address, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Ethereum.getTxs(address, options)
      const currentRootchainTxs = response.data.result
      resolve(currentRootchainTxs)
    } catch (err) {
      reject(err)
    }
  })
}
