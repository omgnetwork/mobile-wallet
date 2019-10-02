import { createAction, createAsyncAction } from './actionCreators'
import { transactionService } from 'common/services'

export const invalidatePendingTx = (dispatch, resolvedTx) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_PENDING_TX',
    operation: () => ({
      resolvedPendingTx: resolvedTx
    })
  })
}

export const fetchTransactionHistory = (address, provider, options) => {
  const asyncAction = async () => {
    const transactions = await transactionService.getTxs(
      address,
      provider,
      options
    )

    return { transactions }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'TRANSACTION/ALL'
  })
}
