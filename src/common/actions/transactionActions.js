import { createAction, createAsyncAction } from './actionCreators'
import { TransactionActionTypes } from 'common/constants'
import { transactionService } from 'common/services'

export const invalidateUnconfirmedTx = (dispatch, confirmedTx) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_PENDING_TX',
    operation: () => ({
      confirmedTx
    })
  })
}

export const invalidatePendingExitTx = (dispatch, confirmedTx) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_PENDING_EXIT_TX',
    operation: () => ({
      confirmedTx
    })
  })
}

export const invalidateFeedbackCompleteTx = (dispatch, wallet) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_FEEDBACK_COMPLETE_TX',
    operation: () => ({
      wallet
    })
  })
}

export const updateMergeUtxosBlknum = (dispatch, address, blknum) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/UPDATE_MERGE_UTXOS_BLKNUM',
    operation: () => ({
      address,
      blknum,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
    })
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
