import { NativeModules } from 'react-native'

const SecureEncrypt = NativeModules.SecureEncrypt

export const KEYSTORE_ALIAS = 'network.omisego.plasmawallet.ks'

export const init = (alias = KEYSTORE_ALIAS) => {
  return SecureEncrypt.init(alias)
}

export const encrypt = msg => {
  return SecureEncrypt.encrypt(msg)
}

export const decrypt = msg => {
  return SecureEncrypt.decrypt(msg)
}
