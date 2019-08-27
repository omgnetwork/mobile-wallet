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

export const importByMnemonic = (wallets, mnemonic, provider, name) => {
  const asyncAction = async () => {
    return await walletService.importByMnemonic(
      wallets,
      mnemonic,
      provider,
      name
    )
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/IMPORT'
  })
}

export const clear = dispatch => {
  return createAction(dispatch, {
    operation: () => {},
    type: 'WALLET/DELETE_ALL'
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
    type: 'WALLET/LOAD_ASSETS',
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
