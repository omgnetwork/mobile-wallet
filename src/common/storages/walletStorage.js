import { storageUtils } from '../utils'

export const add = async ({ address, balance }) => {
  const wallets = (await all()) || []

  if (wallets.filter(w => w.address === address).length > 0) {
    throw 'The wallet has been already added.'
  }

  const wallet = {
    address: address,
    balance: balance
  }

  await storageUtils.set('wallets', JSON.stringify([...wallets, wallet]))
  return wallet
}

export const all = async () => {
  try {
    const result = (await storageUtils.get('wallets')) || '[]'
    return JSON.parse(result)
  } catch (err) {
    console.log(err)
    return []
  }
}

export const clear = () => {
  return storageUtils.clearAll()
}

export const setPrivateKey = ({ address, privateKey }) => {
  return storageUtils.secureSet(address, privateKey)
}

export const getPrivateKey = address => {
  return storageUtils.secureGet(address)
}
