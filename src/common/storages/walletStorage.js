import { Storage } from '../utils'

export const setMnemonic = ({ address, mnemonic }) => {
  return Storage.secureSet(address, mnemonic)
}

export const getMnemonic = address => {
  return Storage.secureGet(address)
}
