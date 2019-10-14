export const transactionReducer = (
  state = {
    pendingTxs: [],
    pendingExits: [],
    transactions: [],
    feedbackCompleteTx: null
  },
  action
) => {
  switch (action.type) {
    case 'ROOTCHAIN/SEND_ETH_TOKEN/SUCCESS':
    case 'ROOTCHAIN/SEND_ERC20_TOKEN/SUCCESS':
    case 'CHILDCHAIN/SEND_TOKEN/SUCCESS':
    case 'CHILDCHAIN/DEPOSIT_ETH_TOKEN/SUCCESS':
    case 'CHILDCHAIN/DEPOSIT_ERC20_TOKEN/SUCCESS':
    case 'CHILDCHAIN/EXIT/SUCCESS':
      return {
        ...state,
        pendingTxs: [...state.pendingTxs, action.data],
        feedbackCompleteTx: null
      }
    case 'TRANSACTION/INVALIDATE_PENDING_TX/OK':
      return {
        ...state,
        feedbackCompleteTx: action.data.resolvedPendingTx,
        pendingTxs: state.pendingTxs.filter(
          pendingTx => pendingTx.hash !== action.data.resolvedPendingTx.hash
        ),
        pendingExits:
          action.data.resolvedPendingTx.type === 'CHILDCHAIN_EXIT'
            ? [...state.pendingExits, action.data.resolvedPendingTx]
            : state.pendingExits
      }
    case 'TRANSACTION/INVALIDATE_PENDING_EXIT_TX/OK':
      return {
        ...state,
        pendingExits: state.pendingExits.filter(
          pendingTx => pendingTx.hash !== action.data.resolvedPendingTx.hash
        )
      }
    case 'WALLET/DELETE_ALL/OK':
    case 'SETTING/SET_PRIMARY_ADDRESS/OK':
      return {
        transactions: [],
        pendingTxs: [],
        pendingExits: [],
        feedbackCompleteTx: null
      }
    case 'TRANSACTION/INVALIDATE_FEEDBACK_COMPLETE_TX/OK':
      return {
        ...state,
        feedbackCompleteTx: null
      }
    case 'TRANSACTION/ALL/SUCCESS':
      return { ...state, transactions: action.data.transactions }
    default:
      return state
  }
}
