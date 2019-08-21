export const transactionReducer = (state = { pendingTxs: [] }, action) => {
  switch (action.type) {
    case 'TRANSACTION/SEND_ETH_TOKEN/SUCCESS':
    case 'TRANSACTION/SEND_ERC20_TOKEN/SUCCESS':
      return { ...state, pendingTxs: [...state.pendingTxs, action.data] }
    default:
      return state
  }
}
