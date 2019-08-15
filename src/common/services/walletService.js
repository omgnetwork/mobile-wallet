import { ethersUtils } from '../utils'
import { walletStorage, settingStorage } from '../storages'

export const create = (provider, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wallet = ethersUtils.createWallet()
      const connectedProviderWallet = wallet.connect(provider)

      const privateKey = await connectedProviderWallet.privateKey
      const address = await connectedProviderWallet.address
      const balance = await connectedProviderWallet.getBalance()

      await walletStorage.setPrivateKey({ address, privateKey })
      await walletStorage.add({ address, balance, name })

      resolve({ address, balance, name })
    } catch (err) {
      reject(err)
    }
  })
}

export const get = async (address, provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      const privateKey = await walletStorage.getPrivateKey(address)
      const wallet = ethersUtils.importWalletByPrivateKey(privateKey)
      const connectedProviderWallet = wallet.connect(provider)
      resolve(connectedProviderWallet)
    } catch (err) {
      reject(err)
    }
  })
}

export const getEthBalance = address => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ethersUtils.getEthBalance(address)
      const balance = response.data.result
      const formattedBalance = ethersUtils.formatUnits(balance, 18)
      resolve(formattedBalance)
    } catch (err) {
      reject(err)
    }
  })
}

export const importByMnemonic = (mnemonic, provider, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mnemonic.split(' ').length !== 12) {
        throw 'Invalid mnemonic'
      }

      if (!name) {
        throw 'Wallet name is empty'
      }

      const wallet = ethersUtils.importWalletByMnemonic(mnemonic)
      const connectedProviderWallet = wallet.connect(provider)

      const privateKey = await connectedProviderWallet.privateKey
      const address = await connectedProviderWallet.address
      const balance = await connectedProviderWallet.getBalance()

      await walletStorage.setPrivateKey({ address, privateKey })

      const newWallet = { address, balance, name: name }
      await walletStorage.add(newWallet)

      resolve(newWallet)
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

export const setPrimaryAddress = address => {
  return new Promise(async (resolve, reject) => {
    try {
      await settingStorage.setPrimaryAddress(address)
      resolve(address)
    } catch (err) {
      reject(err)
    }
  })
}

export const getPrimaryAddress = defaultAddress => {
  return new Promise((resolve, reject) => {
    try {
      const primaryAddress = settingStorage.getPrimaryAddress(defaultAddress)
      resolve(primaryAddress)
    } catch (err) {
      reject(err)
    }
  })
}
