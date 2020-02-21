import { Storage } from '../utils'

export const setPrivateKey = ({ address, privateKey }) => {
  return Storage.secureSet(address, privateKey)
}

export const getPrivateKey = address => {
  return Storage.secureGet(address)
}

export const setMnemonic = ({ address, mnemonic }) => {
  return Storage.secureSet(`${address}_mn`, mnemonic)
}

export const getMnemonic = address => {
  return Storage.secureGet(`${address}_mn`)
}
