import { walletStorage } from '../storages'
import { Ethereum } from 'common/blockchain'

export const get = async (address, provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mnemonic = await walletStorage.getMnemonic(address)
      const wallet = Ethereum.importWalletMnemonic(mnemonic)
      const connectedProviderWallet = wallet.connect(provider)
      resolve(connectedProviderWallet)
    } catch (err) {
      reject(err)
    }
  })
}

export const importByMnemonic = (wallets, mnemonic, provider, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mnemonic.split(' ').length !== 12) {
        throw new Error('Invalid mnemonic')
      }

      if (!name) {
        throw new Error('Wallet name is empty')
      }

      const wallet = Ethereum.importWalletMnemonic(mnemonic)
      const connectedProviderWallet = wallet.connect(provider)

      const address = await connectedProviderWallet.address
      const balance = await connectedProviderWallet.getBalance()

      if (wallets.find(w => w.address === address)) {
        throw new Error(
          'Cannot add the wallet. The wallet has already existed.'
        )
      } else if (wallets.find(w => w.name === name)) {
        throw new Error(
          'Cannot add the wallet. The wallet name has already been taken.'
        )
      }

      await walletStorage.setMnemonic({ address, mnemonic })

      const newWallet = { address, name, balance }

      resolve({ wallet: newWallet, blockchainWallet: connectedProviderWallet })
    } catch (err) {
      reject(err)
    }
  })
}
