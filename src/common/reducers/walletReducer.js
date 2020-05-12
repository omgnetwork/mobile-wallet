import Config from 'react-native-config'
import { BlockchainNetworkType } from 'common/constants'

export const walletsReducer = (state = [], action) => {
  switch (action.type) {
    case 'WALLET/CREATE/SUCCESS':
    case 'WALLET/IMPORT/SUCCESS':
      return [
        ...state,
        {
          ...action.data.wallet,
          shouldRefreshChildchain: false,
          shouldRefresh: false
        }
      ]
    case 'WALLET/SYNC/SUCCESS':
      return action.data.wallets
    case 'WALLET/DELETE_ALL/OK':
      return []
    case 'WALLET/DELETE/OK':
      return state.filter(
        wallet => wallet.address !== action.data.walletAddress
      )
    case 'WALLET/GET_TX_HISTORY/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return { ...wallet, txHistory: action.data.txHistory }
        } else {
          return wallet
        }
      })
    case 'ROOTCHAIN/FETCH_ASSETS/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return {
            ...wallet,
            rootchainAssets: action.data.rootchainAssets,
            shouldRefresh: false,
            updatedAt: action.data.updatedAt,
            updatedBlock: action.data.updatedBlock,
            ethereumNetwork: Config.ETHEREUM_NETWORK
          }
        } else {
          return wallet
        }
      })
    case 'CHILDCHAIN/FETCH_ASSETS/SUCCESS':
      return state.map(wallet => {
        const {
          address,
          childchainAssets,
          updatedAt,
          fromUtxoPos
        } = action.data
        if (wallet.address === address) {
          return {
            ...wallet,
            childchainAssets,
            updatedAt,
            fromUtxoPos,
            shouldRefreshChildchain: false,
            plasmaFrameworkContractAddress:
              Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
          }
        } else {
          return wallet
        }
      })
    case 'WALLET/REFRESH_CHILDCHAIN/OK':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return {
            ...wallet,
            shouldRefreshChildchain: action.data.shouldRefresh
          }
        } else {
          return wallet
        }
      })
    case 'WALLET/REFRESH_BOTH/OK':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return {
            ...wallet,
            shouldRefreshChildchain: action.data.shouldRefresh,
            shouldRefresh: action.data.shouldRefresh
          }
        } else {
          return wallet
        }
      })
    case 'WALLET/REFRESH_ROOTCHAIN/OK':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return { ...wallet, shouldRefresh: action.data.shouldRefresh }
        } else {
          return wallet
        }
      })
    case 'CHILDCHAIN/SET_SHOULD_REFRESH/OK':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return {
            ...wallet,
            shouldRefreshChildchain: action.data.shouldRefresh
          }
        } else {
          return wallet
        }
      })
    case 'SETTING/SET_PRIMARY_WALLET/OK':
      return state.map(wallet => {
        const isEthNetwork =
          action.data.primaryWalletNetwork ===
          BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
        if (wallet.address === action.data.primaryWalletAddress) {
          return {
            ...wallet,
            shouldRefresh: isEthNetwork,
            shouldRefreshChildchain: !isEthNetwork
          }
        } else {
          return wallet
        }
      })
    default:
      return state
  }
}

const mergeAssets = (oldAssets, newAssets) => {
  const contractAddresses = [...oldAssets, ...newAssets].map(
    asset => asset.contractAddress
  )
  const contractAddressSet = new Set(contractAddresses)
  const contractAddressList = Array.from(contractAddressSet)

  return contractAddressList.map(contractAddress => {
    const oldAsset = oldAssets.find(
      asset => asset.contractAddress === contractAddress
    )
    const newAsset = newAssets.find(
      asset => asset.contractAddress === contractAddress
    )
    return newAsset || oldAsset
  })
}

const fromSamePlasmaContract = wallet => {
  return (
    wallet.plasmaFrameworkContractAddress ===
    Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
  )
}

const fromSameEthereumNetwork = wallet => {
  return wallet.ethereumNetwork === Config.ETHEREUM_NETWORK
}
