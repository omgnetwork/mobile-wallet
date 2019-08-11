export const walletsReducer = (state = [], action) => {
  switch (action.type) {
    case 'WALLET/CREATE/SUCCESS':
    case 'WALLET/IMPORT/SUCCESS':
      return [...state, action.data]
    case 'WALLET/SYNC/SUCCESS':
      return action.data.wallets
    case 'WALLET/DELETE_ALL/SUCCESS':
      return []
    case 'WALLET/GET_TX_HISTORY/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return { ...wallet, txHistory: action.data.txHistory }
        } else {
          return wallet
        }
      })
    case 'WALLET/INIT_ASSETS/SUCCESS':
      return state.map(wallet => {
        if (wallet.address === action.data.address) {
          return { ...wallet, assets: action.data.assets }
        } else {
          return wallet
        }
      })
    default:
      return state
  }
}
