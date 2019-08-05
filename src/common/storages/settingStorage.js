import { storageUtils } from '../utils'

export const setProviderName = providerName => {
  return storageUtils.set('setting_provider_name', providerName)
}

export const getProviderName = () => {
  return storageUtils.get('setting_provider_name')
}
