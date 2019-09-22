export const transactionReducer = (state = { pendingTxs: [] }, action) => {
  switch (action.type) {
    case 'ROOTCHAIN/SEND_ETH_TOKEN/SUCCESS':
    case 'ROOTCHAIN/SEND_ERC20_TOKEN/SUCCESS':
    case 'CHILDCHAIN/SEND_TOKEN/SUCCESS':
    case 'CHILDCHAIN/DEPOSIT_ETH_TOKEN/SUCCESS':
    case 'CHILDCHAIN/DEPOSIT_ERC20_TOKEN/SUCCESS':
    case 'CHILDCHAIN/EXIT/SUCCESS':
      return { ...state, pendingTxs: [...state.pendingTxs, action.data] }
    case 'CHILDCHAIN/WAIT_DEPOSITING/SUCCESS':
    case 'CHILDCHAIN/WAIT_EXITING/SUCCESS':
    case 'CHILDCHAIN/WAIT_SENDING/SUCCESS':
    case 'ROOTCHAIN/WAIT_SENDING/SUCCESS':
      return {
        ...state,
        pendingTxs: state.pendingTxs.filter(
          pendingTx => pendingTx.hash !== action.data.hash
        )
      }
    case 'CHILDCHAIN/WAIT_SENDING/LISTENING':
      return {
        ...state,
        pendingTxs: state.pendingTxs.map(pendingTx =>
          pendingTx.type === 'CHILDCHAIN_SEND_TOKEN'
            ? { ...pendingTx, resubscribe: false }
            : pendingTx
        )
      }
    case 'ROOTCHAIN/INVALIDATE_PENDING_TXS/SUCCESS':
    case 'CHILDCHAIN/INVALIDATE_PENDING_TXS/SUCCESS':
      const resolvedPendingTxHashes = action.data.resolvedPendingTxs.map(
        tx => tx.hash
      )
      return {
        ...state,
        pendingTxs: state.pendingTxs
          .filter(
            pendingTx => resolvedPendingTxHashes.indexOf(pendingTx.hash) === -1
          )
          .map(tx => {
            if (tx.type === 'CHILDCHAIN_SEND_TOKEN') {
              return { ...tx, resubscribe: true }
            } else {
              return tx
            }
          })
      }
    case 'WALLET/DELETE_ALL/OK':
      return { pendingTxs: [] }
    default:
      return state
  }
}
