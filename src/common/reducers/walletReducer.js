export const walletsReducer = (state = [], action) => {
  switch (action.type) {
    case 'WALLET/CREATE/SUCCESS':
    case 'WALLET/IMPORT/SUCCESS':
      return [...state, { ...action.data, shouldRefreshChildchain: true }]
    case 'WALLET/SYNC/SUCCESS':
      return action.data.wallets
    case 'WALLET/DELETE_ALL/OK':
      return []
    case 'WALLET/GET_TX_HISTORY/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return { ...wallet, txHistory: action.data.txHistory }
        } else {
          return wallet
        }
      })
    case 'WALLET/LOAD_ASSETS/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          const rootchainAssets = wallet.rootchainAssets || []
          return {
            ...wallet,
            rootchainAssets: mergeAssets(
              rootchainAssets,
              action.data.rootchainAssets
            ),
            shouldRefresh: false,
            updatedAt: action.data.updatedAt,
            updatedBlock: action.data.updatedBlock
          }
        } else {
          return wallet
        }
      })
    case 'CHILDCHAIN/LOAD_ASSETS/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          const childchainAssets = wallet.childchainAssets || []
          return {
            ...wallet,
            childchainAssets: mergeAssets(
              childchainAssets,
              action.data.childchainAssets
            ),
            shouldRefreshChildchain: false
          }
        } else {
          return wallet
        }
      })
    case 'CHILDCHAIN/WAIT_DEPOSITING/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.from) {
          return {
            ...wallet,
            shouldRefresh: true,
            shouldRefreshChildchain: true
          }
        } else {
          return wallet
        }
      })
    case 'CHILDCHAIN/WAIT_EXITING/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.from) {
          return {
            ...wallet,
            shouldRefresh: false,
            shouldRefreshChildchain: true
          }
        } else {
          return wallet
        }
      })
    case 'ROOTCHAIN/WAIT_SENDING/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.from) {
          return { ...wallet, shouldRefresh: true }
        } else {
          return wallet
        }
      })
    case 'CHILDCHAIN/WAIT_SENDING/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.from) {
          return { ...wallet, shouldRefreshChildchain: true }
        } else {
          return wallet
        }
      })
    case 'WALLET/SET_SHOULD_REFRESH/OK':
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
