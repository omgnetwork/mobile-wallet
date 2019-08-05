import { ethersUtils } from '../utils'
import { walletStorage } from '../storages'

export const create = provider => {
  return new Promise(async (resolve, reject) => {
    try {
      const wallet = ethersUtils.createWallet()
      const connectedProviderWallet = wallet.connect(provider)

      const privateKey = await connectedProviderWallet.privateKey
      const address = await connectedProviderWallet.address
      const balance = await connectedProviderWallet.getBalance()

      await walletStorage.setPrivateKey({ address, privateKey })
      await walletStorage.add({ address, balance })

      resolve({ address, balance })
    } catch (err) {
      reject(err)
    }
  })
}

export const get = async (address, provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      const privateKey = await walletStorage.getWalletPrivateKey(address)
      const wallet = ethersUtils.importWalletByPrivateKey(privateKey)
      const connectedProviderWallet = wallet.connect(provider)
      resolve(connectedProviderWallet)
    } catch (err) {
      reject(err)
    }
  })
}

export const importByMnemonic = (mnemonic, provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mnemonic.split(' ').length !== 12) {
        throw 'Invalid mnemonic'
      }

      const wallet = ethersUtils.importWalletByMnemonic(mnemonic)
      const connectedProviderWallet = wallet.connect(provider)

      const privateKey = await connectedProviderWallet.privateKey
      const address = await connectedProviderWallet.address
      const balance = await connectedProviderWallet.getBalance()

      await walletStorage.setPrivateKey({ address, privateKey })
      await walletStorage.add({ address, balance })

      resolve({ address, balance })
    } catch (err) {
      reject(err)
    }
  })
}

export const clear = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await walletStorage.clear()
      resolve([])
    } catch (err) {
      reject(err)
    }
  })
}

export const all = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const wallets = await walletStorage.all()
      resolve(wallets)
    } catch (err) {
      reject(err)
    }
  })
}
