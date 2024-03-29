import { walletService, providerService } from '../services'
import { createAsyncAction, createAction } from './actionCreators'

export const create = (wallets, mnemonic, provider, name) => {
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
    type: 'WALLET/IMPORT',
    reportError: false
  })
}

export const clear = dispatch => {
  return createAction(dispatch, {
    operation: () => {},
    type: 'WALLET/DELETE_ALL'
  })
}

export const deleteWallet = (dispatch, wallets, walletAddress) => {
  return createAction(dispatch, {
    operation: () => ({ wallets, walletAddress }),
    type: 'WALLET/DELETE'
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

export const refreshRootchain = (dispatch, address, shouldRefresh) => {
  return createAction(dispatch, {
    operation: () => ({
      address,
      shouldRefresh
    }),
    type: 'WALLET/REFRESH_ROOTCHAIN'
  })
}

export const refreshChildchain = (dispatch, address, shouldRefresh) => {
  return createAction(dispatch, {
    operation: () => ({
      address,
      shouldRefresh
    }),
    type: 'WALLET/REFRESH_CHILDCHAIN'
  })
}

export const refreshAll = (dispatch, address, shouldRefresh) => {
  return createAction(dispatch, {
    operation: () => ({
      address,
      shouldRefresh
    }),
    type: 'WALLET/REFRESH_BOTH'
  })
}

export const setShouldRefreshChildchain = (
  dispatch,
  address,
  shouldRefreshChildchain
) => {
  return createAction(dispatch, {
    operation: () => ({
      address,
      shouldRefreshChildchain
    }),
    type: 'CHILDCHAIN/SET_SHOULD_REFRESH'
  })
}
