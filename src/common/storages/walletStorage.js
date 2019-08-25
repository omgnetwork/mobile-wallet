import { Storage } from '../utils'

export const all = async () => {
  try {
    const result = (await Storage.get('wallets')) || '[]'
    return JSON.parse(result)
  } catch (err) {
    console.log(err)
    return []
  }
}

export const clear = () => {
  return Storage.clearAll()
}

export const setPrivateKey = ({ address, privateKey }) => {
  return Storage.secureSet(address, privateKey)
}

export const getPrivateKey = address => {
  return Storage.secureGet(address)
}
