import { ethersUtils } from '../utils'
import { settingStorage } from '../storages'

export const create = providerName => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = ethersUtils.createProvider(providerName)
      await settingStorage.setProviderName(providerName)
      resolve(provider)
    } catch (err) {
      reject(err)
    }
  })
}

export const getName = async defaultProviderName => {
  const providerName = await settingStorage.getProviderName()
  return providerName || defaultProviderName
}
