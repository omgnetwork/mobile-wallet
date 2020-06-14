import { useState, useCallback, useEffect } from 'react'
import Config from 'react-native-config'
import { TransactionActionTypes } from 'common/constants'
import { Transaction } from 'common/blockchain'

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
      case TransactionActionTypes.TYPE_ROOTCHAIN_SEND_TOKEN:
        return pending
          ? 'Pending transfer on Ethereum'
          : 'Transfer sent on Ethereum'
      case TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN:
        return pending
          ? 'Pending transfer on the OMG Network'
          : 'Transfer sent on the OMG Network'
      case TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT:
        return pending ? 'Pending Deposit...' : 'Deposited to the OMG Network.'
      case TransactionActionTypes.TYPE_CHILDCHAIN_EXIT:
        return pending
          ? 'Submitting a Withdrawal Request...'
          : 'Submitted a Withdrawal Request.'
      case TransactionActionTypes.TYPE_CHILDCHAIN_PROCESS_EXIT:
        return pending ? 'Processing Withdrawal...' : 'Withdrawal Successful'
      case TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS:
        return pending ? 'Merging Tokens...' : 'All set!'
      default:
        return null
    }
  }, [])

  const getSubtitle = useCallback((pending, actionType) => {
    switch (actionType) {
      case TransactionActionTypes.TYPE_ROOTCHAIN_SEND_TOKEN:
      case TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN:
        return pending ? 'Please wait' : 'The transaction is being finalised'
      case TransactionActionTypes.TYPE_CHILDCHAIN_EXIT:
        return pending
          ? 'Please wait'
          : 'Your withdrawal is pending. We will notify you once it finalizes.'
      case TransactionActionTypes.TYPE_CHILDCHAIN_PROCESS_EXIT:
        return pending ? 'Please wait' : 'Your funds are now on Ethereum.'
      case TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS:
        return pending
          ? 'We’re merging UTXOs. You can not transfer during this time.'
          : 'Merged UTXOs. You can now transfer as usual.'
    }
  }, [])

  const getExternalLink = useCallback((actionType, hash) => {
    switch (actionType) {
      case TransactionActionTypes.TYPE_ROOTCHAIN_SEND_TOKEN:
        return {
          url: `${Config.ETHERSCAN_URL}tx/${hash}`,
          title: 'View on Etherscan'
        }
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

  const getInternalLink = useCallback(actionType => {
    switch (actionType) {
      case TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN:
        return {
          title: 'View Transaction'
        }
      default:
        return null
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
          subtitle: getSubtitle(true, actionType)
        }
      } else {
        return {
          title: getTransactionFeedbackTitle(false, actionType),
          actionType: actionType,
          hash: hash,
          pending: false,
          subtitle: getSubtitle(false, actionType),
          externalLink: getExternalLink(actionType, hash),
          internalLink: getInternalLink(actionType)
        }
      }
    },
    [getExternalLink, getInternalLink, getSubtitle, getTransactionFeedbackTitle]
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
