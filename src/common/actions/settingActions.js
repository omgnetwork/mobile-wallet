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

export const setBlockchainWallet = (wallet, provider) => {
  const asyncAction = async () => {
    if (wallet) {
      const blockchainWallet = await walletService.get(wallet.address, provider)
      return {
        blockchainWallet
      }
    } else {
      return {
        blockchainWallet: null
      }
    }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'SETTING/SET_BLOCKCHAIN_WALLET'
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
