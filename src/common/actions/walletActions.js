import { walletService, providerService, priceService } from '../services'
import { createAsyncAction } from './actionCreators'
import Config from 'react-native-config'

export const create = (provider, name) => {
  const asyncAction = async () => {
    return await walletService.create(provider, name)
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/CREATE'
  })
}

export const importByMnemonic = (mnemonic, provider, name) => {
  const asyncAction = async () => {
    return await walletService.importByMnemonic(mnemonic, provider, name)
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

export const getTransactionHistory = address => {
  const asyncAction = async () => {
    const txHistory = await providerService.getTransactionHistory(address)

    return { address, txHistory }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'WALLET/GET_TX_HISTORY'
  })
}

export const loadAssets = (provider, address) => {
  const asyncAction = async () => {
    const txHistory = await providerService.getTransactionHistory(address)

    const distinctTx = Array.from(
      new Set(txHistory.map(tx => tx.contractAddress))
    )

    const fetchEth = async () => {
      const pendingBalance = walletService.getEthBalance(address)
      const pendingPrice = priceService.fetchPriceUsd(
        '0x',
        Config.ETHERSCAN_NETWORK
      )

      const [balance, price] = await Promise.all([pendingBalance, pendingPrice])

      return {
        tokenName: 'Ether',
        tokenSymbol: 'ETH',
        tokenDecimal: 18,
        contractAddress: '0x',
        balance: balance,
        price: price
      }
    }

    const unresolvedEth = fetchEth()
    const unresolvedErc20 = distinctTx.map(async contractAddress => {
      const tx = txHistory.find(t => t.contractAddress === contractAddress)

      const pendingBalance = providerService.getTokenBalance(
        provider,
        tx.contractAddress,
        tx.tokenDecimal,
        address
      )

      const pendingPrice = priceService.fetchPriceUsd(
        tx.contractAddress,
        Config.ETHERSCAN_NETWORK
      )

      const [balance, price] = await Promise.all([pendingBalance, pendingPrice])

      return {
        tokenName: tx.tokenName,
        tokenSymbol: tx.tokenSymbol,
        tokenDecimal: tx.tokenDecimal,
        contractAddress: tx.contractAddress,
        balance: balance,
        price: price
      }
    })

    const assets = await Promise.all([unresolvedEth, ...unresolvedErc20])

    return {
      address,
      assets
    }
  }

  return createAsyncAction({
    type: 'WALLET/INIT_ASSETS',
    operation: asyncAction
  })
}
