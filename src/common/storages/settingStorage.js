import { storageUtils } from '../utils'

export const setProviderName = providerName => {
  if (!providerName) return null
  return storageUtils.set('setting_provider_name', providerName)
}

export const getProviderName = () => {
  return storageUtils.get('setting_provider_name')
}

export const setPrimaryAddress = address => {
  if (!address) return Promise.resolve(null)
  return storageUtils.set('primary_wallet_address', address)
}

export const getPrimaryAddress = async defaultAddress => {
  return (await storageUtils.get('primary_wallet_address')) || defaultAddress
}
