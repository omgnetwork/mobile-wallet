import { settingStorage } from '../storages'
import { createAction, createAsyncAction } from './actionCreators'
import { createProvider } from '../utils/ethers'

export const setProvider = (dispatch, providerName) => {
  const action = () => {
    const provider = createProvider(providerName)
    settingStorage.setProviderName(providerName)
    return provider
  }
  return createAction(dispatch, { operation: action, type: 'PROVIDER/SET' })
}

export const syncProviderToStore = providerName => {
  const action = async () => {
    const name = providerName || (await settingStorage.getProviderName())
    return createProvider(name)
  }
  return createAsyncAction({ operation: action, type: 'PROVIDER/SYNC' })
}
