import { walletService, providerService } from '../services'
import { createAsyncAction, createAction } from './actionCreators'

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
    const updatedWallets = wallets.map(wallet => {
      if (wallet.assets && wallet.assets.length > 0) {
        return {
          ...wallet,
          shouldRefresh: true
        }
      } else {
        return wallet
      }
    })
    return { wallets: updatedWallets }
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

export const loadAssets = (provider, address, lastBlockNumber) => {
  const asyncAction = async () => {
    const updatedAssets = await walletService.fetchAssets(
      provider,
      address,
      lastBlockNumber
    )

    return updatedAssets
  }

  return createAsyncAction({
    type: 'WALLET/INIT_ASSETS',
    operation: asyncAction,
    isBackgroundTask: lastBlockNumber > 0
  })
}

export const setShouldRefreshWallet = (dispatch, address, shouldRefresh) => {
  return createAction(dispatch, {
    operation: () => ({
      address,
      shouldRefresh
    }),
    type: 'WALLET/SET_SHOULD_REFRESH'
  })
}
