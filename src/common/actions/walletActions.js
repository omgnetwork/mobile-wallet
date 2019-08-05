import { walletService } from '../services'
import { walletStorage } from '../storages'
import { createAsyncAction } from './actionCreators'

export const createWallet = provider => {
  const asyncActions = async () => {
    const wallet = await walletService.create(provider)

    await walletStorage.setWalletPrivateKey(wallet)
    const data = await walletStorage.addWalletInfo(wallet)

    return data
  }

  return createAsyncAction({
    operation: asyncActions,
    type: 'WALLET/CREATE'
  })
}

export const deleteAll = () => {
  const asyncActions = async () => {
    await walletStorage.clearWalletInfos()
    return []
  }

  return createAsyncAction({
    operation: asyncActions,
    type: 'WALLET/DELETE_ALL'
  })
}

export const syncWalletsToStore = () => {
  const asyncActions = async () => {
    const wallets = await walletStorage.getWalletInfos()
    return { wallets }
  }

  return createAsyncAction({
    operation: asyncActions,
    type: 'WALLET/SYNC'
  })
}

export const importWalletByMnemonic = (mnemonic, provider) => {
  const asyncActions = async () => {
    if (mnemonic.split(' ').length !== 12) {
      console.log('invalid mnemonic')
      throw 'Invalid mnemonic'
    }
    const wallet = await walletService.importWalletByMnemonic(
      mnemonic,
      provider
    )

    await walletStorage.setWalletPrivateKey(wallet)
    const data = await walletStorage.addWalletInfo(wallet)
    return data
  }

  return createAsyncAction({
    operation: asyncActions,
    type: 'WALLET/IMPORT'
  })
}
