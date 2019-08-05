import { walletService } from '../services'
import { createAsyncAction } from './actionCreators'

export const create = provider => {
  const asyncAction = async () => {
    return await walletService.create(provider)
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/CREATE'
  })
}

export const importByMnemonic = (mnemonic, provider) => {
  const asyncAction = async () => {
    return await walletService.importByMnemonic(mnemonic, provider)
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/IMPORT'
  })
}

export const clear = () => {
  const asyncAction = async () => {
    return await walletService.clear()
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/DELETE_ALL'
  })
}

export const syncAllToStore = () => {
  const asyncAction = async () => {
    const wallets = await walletService.all()
    return { wallets }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/SYNC'
  })
}
