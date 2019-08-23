import { Storage } from '../utils'

export const add = async ({ address, balance, name }) => {
  const wallets = (await all()) || []

  if (wallets.filter(w => w.address === address).length > 0) {
    throw 'The wallet has been already added.'
  }

  const wallet = {
    address: address,
    balance: balance,
    name: name
  }

  await Storage.set('wallets', JSON.stringify([...wallets, wallet]))
  return wallet
}

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
