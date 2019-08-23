import { createAsyncAction } from './actionCreators'
import { providerService, walletService } from '../services'

export const setProvider = providerName => {
  const asyncAction = async () => {
    const provider = await providerService.create(providerName)
    return { provider }
  }
  return createAsyncAction({
    operation: asyncAction,
    type: 'SETTTING/SET_PROVIDER'
  })
}

export const syncProviderToStore = defaultProviderName => {
  const asyncAction = async () => {
    const name = await providerService.getName(defaultProviderName)
    const provider = await providerService.create(name)
    return { provider }
  }
  return createAsyncAction({
    operation: asyncAction,
    type: 'SETTING/SYNC_PROVIDER'
  })
}

export const setPrimaryAddress = address => {
  const asyncAction = async () => {
    const primaryWalletAddress = await walletService.setPrimaryAddress(address)
    return { primaryWalletAddress }
  }

  return createAsyncAction({
    operation: asyncAction,
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

export const syncPrimaryWalletAddressToStore = defaultPrimaryAddress => {
  const asyncAction = async () => {
    const primaryWalletAddress = await walletService.getPrimaryAddress(
      defaultPrimaryAddress
    )

    return { primaryWalletAddress }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'SETTING/SYNC_PRIMARY_ADDRESS'
  })
}
