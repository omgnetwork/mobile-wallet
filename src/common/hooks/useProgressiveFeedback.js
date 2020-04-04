import { useState, useCallback, useEffect } from 'react'
import Config from 'react-native-config'
import { TransactionActionTypes } from 'common/constants'

const useProgressiveFeedback = (
  primaryWallet,
  dispatchInvalidateFeedbackCompleteTx
) => {
  const MILLIS_TO_DISMISS = 8000
  const [feedback, setFeedback] = useState({})
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
    switch (actionType) {
      case TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT:
        return pending ? 'Pending Deposit...' : 'Successfully Deposited!'
      case TransactionActionTypes.TYPE_CHILDCHAIN_EXIT:
        return pending
          ? 'Submitting Exit Request...'
          : 'Submitted Exit request!'
      case TransactionActionTypes.TYPE_CHILDCHAIN_PROCESS_EXIT:
        return pending
          ? 'Pending Process Exit...'
          : 'Successfully Processed Exit!'
      case TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS:
        return pending ? 'Uniting Tokens...' : 'All set!'
      default:
        return pending ? 'Pending Transaction...' : 'Successfully Transferred!'
    }
  }, [])

  const getSubtitle = useCallback(actionType => {
    switch (actionType) {
      case TransactionActionTypes.TYPE_CHILDCHAIN_EXIT:
        return 'We’re merging UTXOs. Hang tight! You can not transfer during this time.'
      case TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS:
        return 'Merged UTXOs. You can now transfer and do any activities as usual.'
    }
  }, [])

  const getExternalLink = useCallback((actionType, hash) => {
    switch (actionType) {
      case TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN:
        return {
          url: `${Config.BLOCK_EXPLORER_URL}transaction?id=${hash}`,
          title: 'View on Block Explorer'
        }
      case TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS:
        return {
          url: `${Config.BLOCK_EXPLORER_URL}block?blknum=${hash}`,
          title: 'View on Block Explorer'
        }
      default:
        return {
          url: `${Config.ETHERSCAN_URL}tx/${hash}`,
          title: 'View on Etherscan'
        }
    }
  }, [])

  const formatFeedbackTx = useCallback(
    transaction => {
      if (!transaction) return {}
      const { actionType, hash } = transaction.result
      if (transaction.pending) {
        return {
          title: getTransactionFeedbackTitle(true, actionType),
          actionType: actionType,
          hash: hash,
          pending: true,
          subtitle: getSubtitle(actionType)
        }
      } else {
        return {
          title: getTransactionFeedbackTitle(false, actionType),
          actionType: actionType,
          hash: hash,
          pending: false,
          subtitle: getSubtitle(actionType),
          link: getExternalLink(actionType, hash)
        }
      }
    },
    [getExternalLink, getSubtitle, getTransactionFeedbackTitle]
  )

  const handleOnClose = useCallback(() => {
    if (completeFeedbackTx) {
      dispatchInvalidateFeedbackCompleteTx(primaryWallet)
    } else {
      setVisible(false)
    }
  }, [completeFeedbackTx, dispatchInvalidateFeedbackCompleteTx, primaryWallet])

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
    handleOnClose
  ]
}

export default useProgressiveFeedback
