import { Platform } from 'react-native'
import { SecureEncryption } from 'common/native'
import SecureStorage from 'react-native-sensitive-info'
import Storage from '@react-native-community/async-storage'

const SECURE_STORAGE_NAME = 'network.omisego.plasmawallet.sp'

export const storage = {
  sharedPreferencesName: SECURE_STORAGE_NAME,
  keychainService: SECURE_STORAGE_NAME
}

export const secureSet = async (key, value) => {
  let storeValue = value
  if (Platform.OS === 'android') {
    storeValue = await SecureEncryption.encrypt(storeValue)
  }
  return SecureStorage.setItem(key, storeValue, storage)
}

export const secureGet = async key => {
  let storedValue = await SecureStorage.getItem(key, storage)
  if (Platform.OS === 'android') {
    storedValue = await SecureEncryption.decrypt(storedValue)
  }
  return storedValue
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
