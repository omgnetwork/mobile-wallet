export const transactionReducer = (
  state = {
    unconfirmedTxs: [],
    transactions: [],
    startedExitTxs: [],
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
        unconfirmedTxs: [...state.unconfirmedTxs, action.data],
        feedbackCompleteTx: null
      }
    case 'TRANSACTION/INVALIDATE_PENDING_TX/OK':
      return {
        ...state,
        feedbackCompleteTx: action.data.resolvedUnconfirmedTx,
        unconfirmedTxs: state.unconfirmedTxs.filter(
          unconfirmedTx =>
            unconfirmedTx.hash !== action.data.resolvedUnconfirmedTx.hash
        )
      }
    case 'WALLET/DELETE_ALL/OK':
    case 'SETTING/SET_PRIMARY_ADDRESS/OK':
      return {
        transactions: [],
        unconfirmedTxs: [],
        startedExitTxs: [],
        feedbackCompleteTx: null
      }
    case 'TRANSACTION/ADD_STARTED_EXIT_TX/OK':
      const startExitTxsSet = new Set(state.startExitTxs)
      startExitTxsSet.add({ ...action.data.exitTx, status: 'started' })
      return {
        ...state,
        startedExitTxs: Array.from(startExitTxsSet)
      }
    case 'TRANSACTION/UPDATE_STARTED_EXIT_TX/OK':
      return {
        ...state,
        startedExitTxs: state.startedExitTxs.map(tx => {
          if (tx.hash === action.data.hash) {
            return {
              ...tx,
              status: action.data.status
            }
          } else {
            return tx
          }
        })
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
