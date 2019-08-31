import { createAsyncAction, createAction } from './actionCreators'
import { providerService, walletService } from '../services'

export const setProvider = providerName => {
  const asyncAction = async () => {
    const provider = await providerService.create(providerName)
    return { provider, providerName }
  }
  return createAsyncAction({
    operation: asyncAction,
    type: 'SETTTING/SET_PROVIDER'
  })
}

export const syncProviderToStore = providerName => {
  const asyncAction = async () => {
    const provider = await providerService.create(providerName)
    return { provider, providerName }
  }
  return createAsyncAction({
    operation: asyncAction,
    type: 'SETTING/SYNC_PROVIDER'
  })
}

export const setPrimaryAddress = (dispatch, address) => {
  const action = () => ({ primaryWalletAddress: address })
  return createAction(dispatch, {
    operation: action,
    type: 'SETTING/SET_PRIMARY_ADDRESS'
  })
}

export const setPrimaryWallet = (address, provider) => {
  const asyncAction = async () => {
    const wallet = await walletService.get(address, provider)
    return { wallet }
  }

  return createAsyncAction({
    type: 'SETTING/SET_PRIMARY_WALLET',
    operation: asyncAction
  })
}
