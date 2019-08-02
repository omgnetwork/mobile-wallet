import { storageUtils } from '../utils'

export const addWalletInfo = async wallet => {
  const address = await wallet.address
  const walletsInfo = (await getWalletInfos()) || []

  if (walletsInfo.filter(w => w.address === address).length > 0) {
    throw 'The wallet has been already added.'
  }

  const newWalletsInfo = [
    ...walletsInfo,
    {
      address: address
    }
  ]

  return storageUtils.set('wallets_info', JSON.stringify(newWalletsInfo))
}

export const getWalletInfos = async () => {
  try {
    const result = (await storageUtils.get('wallets_info')) || '[]'
    return JSON.parse(result)
  } catch (err) {
    console.log(err)
    return []
  }
}

export const clearWalletInfos = () => {
  return storageUtils.clearAll()
}

export const setWalletPrivateKey = async wallet => {
  const address = await wallet.address
  const privateKey = await wallet.privateKey
  return storageUtils.secureSet(address, privateKey)
}

export const getWalletPrivateKey = address => {
  return storageUtils.secureGet(address)
}
