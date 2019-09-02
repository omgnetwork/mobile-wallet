export const transactionReducer = (state = { pendingTxs: [] }, action) => {
  switch (action.type) {
    case 'ROOTCHAIN/SEND_ETH_TOKEN/SUCCESS':
    case 'ROOTCHAIN/SEND_ERC20_TOKEN/SUCCESS':
    case 'CHILDCHAIN/SEND_TOKEN/SUCCESS':
    case 'CHILDCHAIN/DEPOSIT_ETH_TOKEN/SUCCESS':
    case 'CHILDCHAIN/DEPOSIT_ERC20_TOKEN/SUCCESS':
      return { ...state, pendingTxs: [...state.pendingTxs, action.data] }
    case 'CHILDCHAIN/WAIT_DEPOSITING/SUCCESS':
    case 'CHILDCHAIN/WAIT_SENDING/SUCCESS':
    case 'ROOTCHAIN/WAIT_SENDING/SUCCESS':
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
