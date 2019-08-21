import { ethersUtils } from '../utils'

export const sendErc20Token = (token, fromWallet, toAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await ethersUtils.sendErc20Token(
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
