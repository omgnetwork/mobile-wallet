import { ethersUtils } from '../utils'

export const create = provider => {
  return new Promise((resolve, reject) => {
    try {
      const wallet = ethersUtils.createWallet(provider)
      const connectedProviderWallet = wallet.connect(provider)
      resolve(connectedProviderWallet)
    } catch (err) {
      reject(err)
    }
  })
}

export const importWalletByMnemonic = (mnemonic, provider) => {
  return new Promise((resolve, reject) => {
    try {
      const wallet = ethersUtils.importMnemonic(mnemonic)
      const connectedProviderWallet = wallet.connect(provider)
      resolve(connectedProviderWallet)
    } catch (err) {
      reject(err)
    }
  })
}

export const getWallet = (address, provider) => {
  return new Promise((resolve, reject) => {
    try {
      const wallet = ethersUtils.getWallet(address)
      const connectedProviderWallet = wallet.connect(provider)
      resolve(connectedProviderWallet)
    } catch (err) {
      reject(err)
    }
  })
}
