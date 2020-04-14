import { useState, useCallback, useEffect } from 'react'
import Config from 'react-native-config'
import { TransactionActionTypes } from 'common/constants'

const emptyFeedback = {
  title: null,
  type: null,
  hash: null,
  pending: null,
  subTitle: null,
  iconName: null,
  iconColor: null
}

const useProgressiveFeedback = (
  theme,
  primaryWallet,
  dispatchInvalidateFeedbackCompleteTx
) => {
  const MILLIS_TO_DISMISS = 5000
  const [feedback, setFeedback] = useState(emptyFeedback)
  const [visible, setVisible] = useState(false)
  const [unconfirmedTxs, setUnconfirmedTxs] = useState([])
  const [completeFeedbackTx, setCompleteFeedbackTx] = useState(null)

  const selectFeedbackTx = useCallback(() => {
    if (unconfirmedTxs.length > 0) {
      return { result: unconfirmedTxs[0], pending: true }
    } else if (completeFeedbackTx) {
      return { result: completeFeedbackTx, pending: false }
    } else {
      return null
    }
  }, [completeFeedbackTx, unconfirmedTxs])

  const getTransactionFeedbackTitle = useCallback((pending, actionType) => {
    if (pending) {
      switch (actionType) {
        case TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT:
          return 'Pending Deposit...'
        case TransactionActionTypes.TYPE_CHILDCHAIN_EXIT:
          return 'Pending Start Exit...'
        case TransactionActionTypes.TYPE_CHILDCHAIN_PROCESS_EXIT:
          return 'Pending Process Exit...'
        case TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS:
          return 'Merging UTXOs...'
        default:
          return 'Pending Transaction...'
      }
    } else {
      switch (actionType) {
        case TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT:
          return 'Successfully Deposited!'
        case TransactionActionTypes.TYPE_CHILDCHAIN_EXIT:
          return 'Successfully Started Exit!'
        case TransactionActionTypes.TYPE_CHILDCHAIN_PROCESS_EXIT:
          return 'Successfully Processed Exit!'
        case TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS:
          return 'Successfully Merged UTXOs!'
        default:
          return 'Successfully Transferred!'
      }
    }
  }, [])

  const formatFeedbackTx = useCallback(
    transaction => {
      if (!transaction) return emptyFeedback
      const { actionType, hash } = transaction.result

      if (transaction.pending) {
        return {
          title: getTransactionFeedbackTitle(true, actionType),
          actionType: actionType,
          hash: hash,
          pending: true,
          subtitle: hash,
          iconName: 'pending',
          iconColor: theme.colors.yellow
        }
      } else {
        return {
          title: getTransactionFeedbackTitle(false, actionType),
          actionType: actionType,
          hash: hash,
          pending: false,
          subtitle: hash,
          iconName: 'success',
          iconColor: theme.colors.green
        }
      }
    },
    [getTransactionFeedbackTitle, theme.colors.green, theme.colors.yellow]
  )

  const handleOnClose = useCallback(() => {
    if (completeFeedbackTx) {
      dispatchInvalidateFeedbackCompleteTx(primaryWallet)
    } else {
      setVisible(false)
    }
  }, [completeFeedbackTx, dispatchInvalidateFeedbackCompleteTx, primaryWallet])

  const getLearnMoreLink = useCallback(() => {
    if (
      feedback.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
    ) {
      return `${Config.BLOCK_EXPLORER_URL}transaction/${feedback.hash}`
    } else {
      return `${Config.ETHERSCAN_URL}tx/${feedback.hash}`
    }
  }, [feedback.actionType, feedback.hash])

  const startAutoDismiss = useCallback(() => {
    setTimeout(handleOnClose, MILLIS_TO_DISMISS)
  }, [handleOnClose])

  useEffect(() => {
    const feedbackTx = selectFeedbackTx()
    const formattedFeedback = formatFeedbackTx(feedbackTx)
    setFeedback(formattedFeedback)
    setVisible(!!feedbackTx)
    if (formattedFeedback.pending === false) {
      startAutoDismiss()
    }
  }, [formatFeedbackTx, handleOnClose, selectFeedbackTx, startAutoDismiss])

  return [
    feedback,
    visible,
    setUnconfirmedTxs,
    setCompleteFeedbackTx,
    handleOnClose,
    getLearnMoreLink
  ]
}

export default useProgressiveFeedback
