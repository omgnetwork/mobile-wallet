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

export const getERC20Txs = (address, lastBlockNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Ethereum.getERC20Txs(address, lastBlockNumber)
      const currentRootchainTxs = response.data.result
      resolve(currentRootchainTxs)
    } catch (err) {
      reject(err)
    }
  })
}

export const getTxs = (address, lastBlockNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Ethereum.getTxs(address, lastBlockNumber)
      const currentRootchainTxs = response.data.result
      console.log(currentRootchainTxs)
      resolve(currentRootchainTxs)
    } catch (err) {
      reject(err)
    }
  })
}
