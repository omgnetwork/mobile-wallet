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

export const invalidatePendingExitTx = (dispatch, resolvedTx) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_PENDING_EXIT_TX',
    operation: () => ({
      resolvedPendingTx: resolvedTx
    })
  })
}

export const invalidateFeedbackCompleteTx = dispatch => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_FEEDBACK_COMPLETE_TX',
    operation: () => ({})
  })
}

export const addStartedExitTx = (dispatch, exitTx) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/ADD_STARTED_EXIT_TX',
    operation: () => ({
      exitTx
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
