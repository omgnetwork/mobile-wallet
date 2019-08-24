import { walletService, providerService } from '../services'
import { createAsyncAction } from './actionCreators'
import { Datetime } from 'common/utils'

export const create = (provider, name) => {
  const asyncAction = async () => {
    return await walletService.create(provider, name)
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/CREATE'
  })
}

export const importByMnemonic = (mnemonic, provider, name) => {
  const asyncAction = async () => {
    return await walletService.importByMnemonic(mnemonic, provider, name)
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

export const getTransactionHistory = address => {
  const asyncAction = async () => {
    const txHistory = await providerService.getTransactionHistory(address)

    return { address, txHistory }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/GET_TX_HISTORY'
  })
}

export const loadAssets = (provider, address) => {
  const asyncAction = async () => {
    const updatedAssets = await walletService.fetchAssets(provider, address)

    return {
      address,
      assets: updatedAssets.assets,
      updatedBlock: updatedAssets.updatedBlock,
      updatedAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'WALLET/INIT_ASSETS',
    operation: asyncAction
  })
}
