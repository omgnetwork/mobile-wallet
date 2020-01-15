import { useState, useCallback, useEffect } from 'react'
import Config from 'react-native-config'
import { TransactionActionTypes } from 'common/constants'
import { Transaction } from 'common/utils'

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

  const formatFeedbackTx = useCallback(
    transaction => {
      if (!transaction) return emptyFeedback
      const { actionType, hash } = transaction.result

      if (transaction.pending) {
        return {
          title: Transaction.isUnconfirmStartedExitTx(transaction.result)
            ? 'Pending start exit...'
            : 'Pending transaction...',
          actionType: actionType,
          hash: hash,
          pending: true,
          subtitle: hash,
          iconName: 'pending',
          iconColor: theme.colors.yellow3
        }
      } else {
        return {
          title: Transaction.isUnconfirmStartedExitTx(transaction.result)
            ? 'Successfully started exit'
            : 'Successfully transferred!',
          actionType: actionType,
          hash: hash,
          pending: false,
          subtitle: hash,
          iconName: 'success',
          iconColor: theme.colors.green2
        }
      }
    },
    [theme.colors.green2, theme.colors.yellow3]
  )

  const handleOnClose = useCallback(() => {
    if (completeFeedbackTx) {
      dispatchInvalidateFeedbackCompleteTx()
    } else {
      setVisible(false)
    }
  }, [completeFeedbackTx, dispatchInvalidateFeedbackCompleteTx])

  const getLearnMoreLink = useCallback(() => {
    if (
      feedback.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
    ) {
      return `${Config.BLOCK_EXPLORER_URL}transaction/${feedback.hash}`
    } else {
      return `${Config.ETHERSCAN_TX_URL}${feedback.hash}`
    }
  }, [feedback.actionType, feedback.hash])

  const startAutoDismiss = useCallback(() => {
    setTimeout(handleOnClose, MILLIS_TO_DISMISS)
  }, [handleOnClose])

  useEffect(() => {
    const feedbackTx = selectFeedbackTx()
    const formattedFeedback = formatFeedbackTx(feedbackTx)
    setFeedback(formattedFeedback)
    setVisible(feedbackTx !== null)
    if (!formatFeedbackTx.pending) {
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
