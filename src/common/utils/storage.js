import { Platform } from 'react-native'
import { SecureEncryption } from 'common/native'
import SecureStorage from 'react-native-sensitive-info'
import Storage from '@react-native-community/async-storage'

const SECURE_STORAGE_NAME = 'OMGWallet2'

// export const oldStorage = {
//   sharedPreferencesName: 'omgwallet',
//   keychainService: SECURE_STORAGE_NAME
// }

export const storage = {
  sharedPreferencesName: SECURE_STORAGE_NAME,
  keychainService: SECURE_STORAGE_NAME
}

// For Android only
// export const secureExistedDataIfNeeded = async keys => {
//   if (Platform.OS === 'ios') return
//   for (let i = 0; i < keys.length; i++) {
//     const insecuredData = await SecureStorage.getItem(keys[i], oldStorage)
//     const securedData = await SecureEncryption.encrypt(insecuredData)
//     secureSet(keys[i], securedData)
//     await SecureStorage.deleteItem(keys[i])
//   }
// }

export const secureSet = async (key, value) => {
  let storeValue = value
  if (Platform.OS === 'android') {
    storeValue = await SecureEncryption.encrypt(storeValue)
    console.log('encrypted', storeValue)
  }
  return SecureStorage.setItem(key, storeValue, storage)
}

export const secureGet = async key => {
  let storedValue = await SecureStorage.getItem(key, storage)
  console.log('undecrypted', storedValue)
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
