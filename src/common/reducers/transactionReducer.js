export const transactionReducer = (state = { pendingTxs: [] }, action) => {
  switch (action.type) {
    case 'TRANSACTION/SEND_ETH_TOKEN/SUCCESS':
    case 'TRANSACTION/SEND_ERC20_TOKEN/SUCCESS':
    case 'PLASMA/DEPOSIT_ETH_TOKEN/SUCCESS':
      return { ...state, pendingTxs: [...state.pendingTxs, action.data] }
    case 'PLASMA/WAIT_DEPOSITING/SUCCESS':
    case 'TRANSACTION/WAIT_SENDING/SUCCESS':
      return {
        ...state,
        pendingTxs: state.pendingTxs.filter(
          pendingTx => pendingTx.hash !== action.data.hash
        )
      }
    case 'WALLET/DELETE_ALL/OK':
      return { pendingTxs: [] }
    default:
      return state
  }
}
