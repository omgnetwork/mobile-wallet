import SecureStorage from 'react-native-sensitive-info'
import Storage from '@react-native-community/async-storage'

const SECURE_STORAGE_NAME = 'omgwallet'

const options = {
  sharedPreferencesName: SECURE_STORAGE_NAME,
  keychainService: SECURE_STORAGE_NAME
}

export const secureSet = (key, value) => {
  return SecureStorage.setItem(key, value, options)
}

export const secureGet = key => {
  return SecureStorage.getItem(key, options)
}

export const set = (key, value) => {
  return Storage.setItem(key, value)
}

export const get = key => {
  return Storage.getItem(key)
}

export const clearAll = () => {
  return Storage.clear()
}
