import { createAction, createAsyncAction } from './actionCreators'
import { transactionService } from 'common/services'

export const invalidateUnconfirmedTx = (dispatch, resolvedTx) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_PENDING_TX',
    operation: () => ({
      resolvedUnconfirmedTx: resolvedTx
    })
  })
}

export const invalidatePendingExitTx = (dispatch, resolvedTx) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_PENDING_EXIT_TX',
    operation: () => ({
      resolvedUnconfirmedTx: resolvedTx
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

export const updateStartedExitTxStatus = (dispatch, hash, status) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/UPDATE_STARTED_EXIT_TX',
    operation: () => ({
      hash,
      status
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

    const set = new Set(transactions.map(t => t.hash))
    return { transactions }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'TRANSACTION/ALL'
  })
}

export const filteredStartedExitTxs = address => {
  const asyncAction = async () => {
    const {
      unprocessed: remoteStartedExitTxs
    } = await transactionService.getExitTxs(address)

    return {
      remoteStartedExitTxs
    }
  }

  return createAsyncAction({
    operation: asyncAction,
    type: 'TRANSACTION/FILTERED_STARTED_EXIT_TXS'
  })
}
