import { Storage } from '../utils'

export const setPrivateKey = ({ address, privateKey }) => {
  return Storage.secureSet(address, privateKey)
}

export const getPrivateKey = address => {
  return Storage.secureGet(address)
}
