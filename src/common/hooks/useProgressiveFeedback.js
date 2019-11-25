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
  dispatchInvalidateFeedbackCompleteTx
) => {
  const [feedback, setFeedback] = useState(emptyFeedback)
  const [visible, setVisible] = useState(false)
  const [pendingTxs, setPendingTxs] = useState([])
  const [completeFeedbackTx, setCompleteFeedbackTx] = useState(null)

  const selectFeedbackTx = useCallback(() => {
    if (pendingTxs.length > 0) {
      return { result: pendingTxs[0], pending: true }
    } else if (completeFeedbackTx) {
      return { result: completeFeedbackTx, pending: false }
    } else {
      return null
    }
  }, [completeFeedbackTx, pendingTxs])

  const formatFeedbackTx = useCallback(
    transaction => {
      if (!transaction) return emptyFeedback
      if (transaction.pending) {
        return {
          title: 'Pending transaction...',
          actionType: transaction.result.actionType,
          hash: transaction.result.hash,
          pending: transaction.pending,
          subtitle: transaction.result.hash,
          iconName: 'pending',
          iconColor: theme.colors.yellow3
        }
      } else {
        return {
          title: 'Successfully transferred!',
          actionType: transaction.result.actionType,
          hash: transaction.result.hash,
          pending: transaction.pending,
          subtitle: transaction.result.hash,
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
      return `${Config.BLOCK_EXPLORER_URL}/transaction/${feedback.hash}`
    } else {
      return `${Config.ETHERSCAN_TX_URL}${feedback.hash}`
    }
  }, [feedback.actionType, feedback.hash])

  useEffect(() => {
    const feedbackTx = selectFeedbackTx()
    const formattedFeedback = formatFeedbackTx(feedbackTx)

    setFeedback(formattedFeedback)
    setVisible(feedbackTx !== null)
  }, [formatFeedbackTx, selectFeedbackTx])

  return [
    feedback,
    visible,
    setPendingTxs,
    setCompleteFeedbackTx,
    handleOnClose,
    getLearnMoreLink
  ]
}

export default useProgressiveFeedback
