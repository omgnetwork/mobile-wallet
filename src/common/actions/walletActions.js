import { walletService, providerService } from '../services'
import { createAsyncAction, createAction } from './actionCreators'

export const create = (provider, name) => {
  const asyncAction = async () => {
    return await walletService.create(provider, name)
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/CREATE'
  })
}

export const importByMnemonic = (mnemonic, provider) => {
  const asyncAction = async () => {
    return await walletService.importByMnemonic(mnemonic, provider)
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/IMPORT'
  })
}

export const clear = () => {
  const asyncAction = async () => {
    return await walletService.clear()
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/DELETE_ALL'
  })
}

export const syncAllToStore = () => {
  const asyncAction = async () => {
    const wallets = await walletService.all()
    return { wallets }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/SYNC'
  })
}

export const getTransactionHistory = (provider, address) => {
  const asyncAction = async () => {
    const txHistory = await providerService.getTransactionHistory(
      provider,
      address
    )

    return { address, txHistory }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/GET_TX_HISTORY'
  })
}

export const initAssets = (provider, address, txHistory) => {
  const asyncAction = async () => {
    const distinctTx = Array.from(
      new Set(txHistory.map(tx => tx.contractAddress))
    )

    const unresolvedAssets = distinctTx.map(async contractAddress => {
      const tx = txHistory.find(t => t.contractAddress === contractAddress)

      const tokenBalance = await providerService.getTokenBalance(
        provider,
        tx.contractAddress,
        address
      )

      return {
        tokenName: tx.tokenName,
        tokenSymbol: tx.tokenSymbol,
        tokenDecimal: tx.tokenDecimal,
        contractAddress: tx.contractAddress,
        value: tokenBalance
      }
    })

    const assets = await Promise.all(unresolvedAssets)

    return { address, assets }
  }

  return createAsyncAction({
    type: 'WALLET/INIT_ASSETS',
    operation: asyncAction
  })
}
