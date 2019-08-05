import { createAsyncAction } from './actionCreators'
import { providerService } from '../services'

export const setProvider = providerName => {
  const asyncAction = async () => {
    return await providerService.create(providerName)
  }
  return createAsyncAction({ operation: asyncAction, type: 'PROVIDER/SET' })
}

export const syncProviderToStore = defaultProviderName => {
  const asyncAction = async () => {
    const name = await providerService.getName(defaultProviderName)
    return await providerService.create(name)
  }
  return createAsyncAction({ operation: asyncAction, type: 'PROVIDER/SYNC' })
}
