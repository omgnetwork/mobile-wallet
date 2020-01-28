import Config from 'react-native-config'

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
          const rootchainAssets = wallet.rootchainAssets || []
          return {
            ...wallet,
            rootchainAssets: fromSameEthereumNetwork(wallet)
              ? mergeAssets(rootchainAssets, action.data.rootchainAssets)
              : action.data.rootchainAssets,
            shouldRefresh: false,
            updatedAt: action.data.updatedAt,
            updatedBlock: action.data.updatedBlock,
            ethereumNetwork: Config.ETHERSCAN_NETWORK
          }
        } else {
          return wallet
        }
      })
    case 'CHILDCHAIN/FETCH_ASSETS/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          const childchainAssets = wallet.childchainAssets || []
          return {
            ...wallet,
            childchainAssets: fromSamePlasmaContract(wallet)
              ? mergeAssets(childchainAssets, action.data.childchainAssets)
              : action.data.childchainAssets,
            updatedAt: action.data.updatedAt,
            shouldRefreshChildchain: false,
            fromUtxoPos: action.data.fromUtxoPos,
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
    case 'SETTING/SET_PRIMARY_ADDRESS/OK':
      return state.map(wallet => {
        if (wallet.address === action.data.primaryWalletAddress) {
          return {
            ...wallet,
            shouldRefresh: true,
            shouldRefreshChildchain: true
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
  return wallet.ethereumNetwork === Config.ETHERSCAN_NETWORK
}
