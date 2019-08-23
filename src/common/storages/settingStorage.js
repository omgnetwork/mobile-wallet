import { Storage } from '../utils'

export const setProviderName = providerName => {
  if (!providerName) return null
  return Storage.set('setting_provider_name', providerName)
}

export const getProviderName = () => {
  return Storage.get('setting_provider_name')
}

export const setPrimaryAddress = address => {
  if (!address) return Promise.resolve(null)
  return Storage.set('primary_wallet_address', address)
}

export const getPrimaryAddress = async defaultAddress => {
  return (await Storage.get('primary_wallet_address')) || defaultAddress
}
