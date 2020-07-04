import Config from 'react-native-config'
import { useEffect, useCallback, useState } from 'react'
import { NotificationMessages, TransactionActionTypes } from 'common/constants'
import { Wait, Plasma } from 'common/blockchain'
import { notificationService } from 'common/services'

const {
  TYPE_CHILDCHAIN_DEPOSIT,
  TYPE_CHILDCHAIN_EXIT,
  TYPE_CHILDCHAIN_PROCESS_EXIT
} = TransactionActionTypes

const { sendNotification } = notificationService

const getConfirmationsThreshold = actionType => {
  switch (actionType) {
    case TYPE_CHILDCHAIN_DEPOSIT:
      return Config.CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS
    case TYPE_CHILDCHAIN_EXIT:
      return Config.CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS
    default:
      return Config.ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS
  }
}

const useRootchainTracker = (
  { name: walletName },
  dispatchUpdateBlocksToWait,
  cleanup
) => {
  const [pendingTx, setPendingTx] = useState(null)

  const buildNotification = useCallback(
    async ({ actionType, value, symbol }) => {
      switch (actionType) {
        case TYPE_CHILDCHAIN_DEPOSIT:
          return NotificationMessages.NOTIFY_TRANSACTION_DEPOSITED(
            walletName,
            value,
            symbol
          )
        case TYPE_CHILDCHAIN_EXIT:
          return NotificationMessages.NOTIFY_TRANSACTION_START_STANDARD_EXITED(
            walletName,
            value,
            symbol
          )
        case TYPE_CHILDCHAIN_PROCESS_EXIT:
          return NotificationMessages.NOTIFY_TRANSACTION_PROCESSED_EXIT(
            walletName,
            value,
            symbol
          )
        default:
          return NotificationMessages.NOTIFY_TRANSACTION_SENT_ETH_NETWORK(
            walletName,
            value,
            symbol
          )
      }
    },
    [walletName]
  )

  const waitForConfirmation = useCallback(
    ({ hash, actionType }) => {
      return Wait.waitForBlockConfirmation({
        hash,
        intervalMs: 5000,
        blocksToWait: getConfirmationsThreshold(actionType),
        onCountdown: remaining => {
          console.log(`Confirmation is remaining by ${remaining} blocks`)
          dispatchUpdateBlocksToWait({ hash }, remaining)
        }
      })
    },
    [buildNotification]
  )

  const addExitTimeIfNeeded = useCallback(async (tx, receipt) => {
    if (tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT) {
      const {
        scheduledFinalizationTime: exitableAt
      } = await Plasma.getExitTime(receipt.blockNumber, tx.blknum)
      return { ...tx, exitableAt, gasUsed: receipt.gasUsed }
    } else {
      return tx
    }
  }, [])

  useEffect(() => {
    if (pendingTx) {
      const { waitForReceipt, cancel } = waitForConfirmation(pendingTx)

      waitForReceipt
        .then(receipt => addExitTimeIfNeeded(pendingTx, receipt))
        .then(buildNotification)
        .then(sendNotification)
        .then(() => cleanup(pendingTx))

      return cancel
    }
  }, [pendingTx?.hash])

  return [setPendingTx]
}

export default useRootchainTracker
