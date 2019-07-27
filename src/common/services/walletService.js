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
