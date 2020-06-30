import Config from 'react-native-config'
import { useEffect, useCallback, useState } from 'react'
import { NotificationMessages, TransactionActionTypes } from 'common/constants'
import { Wait, Plasma } from 'common/blockchain'

const getConfirmationsThreshold = tx => {
  if (tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT) {
    return Config.CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS
  } else if (tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT) {
    return Config.CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS
  } else {
    return Config.ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS
  }
}

const useRootchainTracker = wallet => {
  const [pendingRootchainTxs, setUnconfirmedRootchainTxs] = useState([])
  const [notification, setNotification] = useState(null)

  const buildNotification = useCallback(
    async confirmedTx => {
      if (
        confirmedTx.actionType ===
        TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT
      ) {
        return {
          ...NotificationMessages.NOTIFY_TRANSACTION_DEPOSITED(
            wallet.current.name,
            confirmedTx.value,
            confirmedTx.symbol
          ),
          type: 'all',
          confirmedTxs: [confirmedTx]
        }
      } else if (
        confirmedTx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT
      ) {
        const {
          scheduledFinalizationTime: exitableAt
        } = await Plasma.getExitTime(
          confirmedTx.rootchainBlockNumber,
          confirmedTx.blknum
        )
        console.log('exitableAt', exitableAt)
        return {
          ...NotificationMessages.NOTIFY_TRANSACTION_START_STANDARD_EXITED(
            wallet.current.name,
            confirmedTx.value,
            confirmedTx.symbol
          ),
          type: 'childchain',
          confirmedTxs: [{ ...confirmedTx, exitableAt }]
        }
      } else if (
        confirmedTx.actionType ===
        TransactionActionTypes.TYPE_CHILDCHAIN_PROCESS_EXIT
      ) {
        return {
          ...NotificationMessages.NOTIFY_TRANSACTION_PROCESSED_EXIT(
            wallet.current.name,
            confirmedTx.value,
            confirmedTx.symbol
          ),
          type: 'childchain',
          confirmedTxs: [confirmedTx]
        }
      } else {
        return {
          ...NotificationMessages.NOTIFY_TRANSACTION_SENT_ETH_NETWORK(
            wallet.current.name,
            confirmedTx.value,
            confirmedTx.symbol
          ),
          type: 'rootchain',
          confirmedTxs: [confirmedTx]
        }
      }
    },
    [wallet]
  )

  const track = useCallback(async () => {
    const latestPendingTx = pendingRootchainTxs.slice(-1).pop()
    const receipt = await Wait.waitForRootchainTransaction({
      hash: latestPendingTx.hash,
      intervalMs: 3000,
      confirmationThreshold: getConfirmationsThreshold(latestPendingTx),
      onCountdown: remaining =>
        console.log(`Confirmation is remaining by ${remaining} blocks`)
    })
    if (receipt) {
      const notificationTxPayload = {
        ...latestPendingTx,
        rootchainBlockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed
      }
      const payload = await buildNotification(notificationTxPayload)
      setNotification(payload)
      setUnconfirmedRootchainTxs(pendingRootchainTxs.slice(0, -1))
    }
  }, [buildNotification, pendingRootchainTxs])

  useEffect(() => {
    if (pendingRootchainTxs.length) {
      track()
    }
  }, [pendingRootchainTxs, track])

  return [notification, setNotification, setUnconfirmedRootchainTxs]
}

export default useRootchainTracker
