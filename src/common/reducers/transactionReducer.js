import { ExitStatus, TransactionActionTypes } from 'common/constants'

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
    case 'CHILDCHAIN/DEPOSIT/SUCCESS':
    case 'CHILDCHAIN/EXIT/SUCCESS':
    case 'CHILDCHAIN/PROCESS_EXIT/SUCCESS':
      return {
        ...state,
        unconfirmedTxs: [action.data],
        feedbackCompleteTx: null
      }
    case 'TRANSACTION/UPDATE_MERGE_UTXOS_BLKNUM/OK': {
      return {
        ...state,
        unconfirmedTxs: [...state.unconfirmedTxs, action.data],
        feedbackCompleteTx: null
      }
    }
    case 'CHILDCHAIN/MERGE_UTXOS/FAILED':
      return {
        ...state,
        unconfirmedTxs: state.unconfirmedTxs.filter(
          tx =>
            tx.actionType !== TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
        ),
        feedbackCompleteTx: null
      }
    case 'CHILDCHAIN/MERGE_UTXOS/SUCCESS':
      return {
        ...state,
        unconfirmedTxs: state.unconfirmedTxs.filter(
          unconfirmedTx =>
            unconfirmedTx.actionType !==
            TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
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
    case 'WALLET/DELETE_ALL/OK':
    case 'SETTING/SET_PRIMARY_ADDRESS/OK':
      return {
        transactions: [],
        unconfirmedTxs: [],
        startedExitTxs: [],
        feedbackCompleteTx: null
      }
    case 'TRANSACTION/ADD_STARTED_EXIT_TX/OK':
      return {
        ...state,
        startedExitTxs: [
          { ...action.data.exitTx, status: ExitStatus.EXIT_STARTED },
          ...state.startedExitTxs
        ]
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
