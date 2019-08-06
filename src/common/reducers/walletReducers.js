export const walletsReducer = (state = [], action) => {
  switch (action.type) {
    case 'WALLET/CREATE/SUCCESS':
    case 'WALLET/IMPORT/SUCCESS':
      return [...state, action.data]
    case 'WALLET/SYNC/SUCCESS':
      return action.data.wallets
    case 'WALLET/DELETE_ALL/SUCCESS':
      return []
    default:
      return state
  }
}
