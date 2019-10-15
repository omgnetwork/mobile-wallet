import { useState, useCallback, useEffect } from 'react'

const emptyFeedback = {
  title: null,
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
          subtitle: transaction.result.hash,
          iconName: 'pending',
          iconColor: theme.colors.yellow3
        }
      } else {
        return {
          title: 'Successfully transferred!',
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
    handleOnClose
  ]
}

export default useProgressiveFeedback
