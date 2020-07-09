import { ExitStatus, TransactionActionTypes } from 'common/constants'

export const transactionReducer = (
  state = {
    deposits: [],
    unconfirmedTxs: [],
    transactions: [],
    startedExitTxs: [],
    feedbackCompleteTx: null
  },
  action
) => {
  switch (action.type) {
    case 'ROOTCHAIN/SEND_TOKEN/SUCCESS':
    case 'CHILDCHAIN/SEND_TOKEN/SUCCESS':
    case 'CHILDCHAIN/DEPOSIT/SUCCESS':
    case 'CHILDCHAIN/EXIT/SUCCESS':
    case 'CHILDCHAIN/PROCESS_EXIT/SUCCESS':
      return {
        ...state,
        unconfirmedTxs: [...state.unconfirmedTxs, action.data],
        feedbackCompleteTx: null
      }

    case 'DEPOSITS/ALL/SUCCESS':
      return { ...state, deposits: action.data.deposits }

    case 'TRANSACTION/UPDATE_MERGE_UTXOS_BLKNUM/OK': {
      const hasMergeTransaction = state.unconfirmedTxs.find(
        tx =>
          tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
      )
      if (hasMergeTransaction) {
        return {
          ...state,
          unconfirmedTxs: state.unconfirmedTxs.map(tx => {
            return tx.actionType ===
              TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
              ? action.data
              : tx
          }),
          feedbackCompleteTx: null
        }
      } else {
        return {
          ...state,
          unconfirmedTxs: [...state.unconfirmedTxs, action.data],
          feedbackCompleteTx: null
        }
      }
    }

    case 'CHILDCHAIN/MERGE_UTXOS/FAILED':
    case 'CHILDCHAIN/MERGE_UTXOS/SUCCESS':
      return {
        ...state,
        unconfirmedTxs: state.unconfirmedTxs.filter(
          tx =>
            tx.actionType !== TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
        ),
        feedbackCompleteTx: action.data
      }
    case 'TRANSACTION/INVALIDATE_PENDING_TX/OK':
      return {
        ...state,
        feedbackCompleteTx: action.data.confirmedTx,
        unconfirmedTxs: state.unconfirmedTxs.filter(
          unconfirmedTx => unconfirmedTx.hash !== action.data.confirmedTx.hash
        )
      }
    case 'TRANSACTION/UPDATE_BLOCKS_TO_WAIT/OK':
      return {
        ...state,
        unconfirmedTxs: state.unconfirmedTxs.map(unconfirmedTx => {
          if (unconfirmedTx.hash === action.data.confirmedTx.hash) {
            return {
              ...unconfirmedTx,
              blocksToWait: action.data.blocksToWait
            }
          } else {
            return unconfirmedTx
          }
        })
      }
    case 'WALLET/DELETE_ALL/OK':
    case 'SETTING/SET_PRIMARY_WALLET/OK':
      return {
        transactions: [],
        unconfirmedTxs: [],
        startedExitTxs: [],
        feedbackCompleteTx: null
      }
    case 'TRANSACTION/ADD_STARTED_EXIT_TX/OK': {
      const existed = state.startedExitTxs.find(
        tx => tx.hash === action.data.exitTx.hash
      )
      if (existed) {
        return state
      }

      return {
        ...state,
        startedExitTxs: [
          { ...action.data.exitTx, status: ExitStatus.EXIT_STARTED },
          ...state.startedExitTxs
        ]
      }
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
    case 'TRANSACTION/FILTERED_STARTED_EXIT_TXS/SUCCESS':
      return {
        ...state,
        startedExitTxs: state.startedExitTxs.filter(s =>
          action.data.remoteStartedExitTxs.includes(s.hash)
        )
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
