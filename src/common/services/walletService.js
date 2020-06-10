import { walletStorage } from '../storages'
import { Ethereum } from 'common/blockchain'

export const get = async (address, provider) => {
  const privateKey = await walletStorage.getPrivateKey(address)
  const wallet = Ethereum.importWalletPrivateKey(privateKey)
  const connectedProviderWallet = wallet.connect(provider)
  return connectedProviderWallet
}

export const importByMnemonic = async (wallets, mnemonic, provider, name) => {
  if (mnemonic.split(' ').length !== 12) {
    throw new Error('Invalid mnemonic')
  }

  if (!name) {
    throw new Error('Wallet name is empty')
  }

  const wallet = Ethereum.importWalletMnemonic(mnemonic)
  const connectedProviderWallet = wallet.connect(provider)

  const address = await connectedProviderWallet.address
  const balance = await connectedProviderWallet.getBalance()

  if (wallets.find(w => w.address === address)) {
    throw new Error('Cannot add the wallet. The wallet has already existed.')
  } else if (wallets.find(w => w.name === name)) {
    throw new Error(
      'Cannot add the wallet. The wallet name has already been taken.'
    )
  }

  await walletStorage.setPrivateKey({
    address,
    privateKey: wallet.privateKey
  })

  const newWallet = { address, name, balance }

  return { wallet: newWallet, blockchainWallet: connectedProviderWallet }
}
