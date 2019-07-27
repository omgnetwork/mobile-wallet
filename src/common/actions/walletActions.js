import { walletService } from '../services'
import { walletStorage } from '../storages'
import { createAsyncAction } from './actionCreators'

export const createWallet = () => {
  const asyncActions = async () => {
    const wallet = await walletService.create()

    await walletStorage.setWalletPrivateKey(wallet)
    await walletStorage.addWalletInfo(wallet)

    return { wallet }
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
