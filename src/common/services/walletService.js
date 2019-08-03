import { ethersUtils } from '../utils'

export const create = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(ethersUtils.createWallet())
    } catch (err) {
      reject(err)
    }
  })
}

export const importWalletByMnemonic = mnemonic => {
  return new Promise((resolve, reject) => {
    try {
      resolve(ethersUtils.importMnemonic(mnemonic))
    } catch (err) {
      reject(err)
    }
  })
}
