import { createAsyncAction, createAction } from './actionCreators'
import { providerService, walletService } from '../services'
import { BlockchainNetworkType } from 'common/constants'

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
    const blockchainWallet = await walletService.get(wallet.address, provider)
    return {
      blockchainWallet
    }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'SETTING/SET_BLOCKCHAIN_WALLET',
    reportError: false
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

export const setPrimaryWallet = (
  dispatch,
  address,
  network = BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
) => {
  const action = () => ({
    primaryWalletAddress: address,
    primaryWalletNetwork: network
  })
  return createAction(dispatch, {
    operation: action,
    type: 'SETTING/SET_PRIMARY_WALLET'
  })
}
