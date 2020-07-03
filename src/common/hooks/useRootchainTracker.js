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

const getConfirmationsThreshold = ({ actionType }) => {
  switch (actionType) {
    case TYPE_CHILDCHAIN_DEPOSIT:
      return Config.CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS
    case TYPE_CHILDCHAIN_EXIT:
      return Config.CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS
    default:
      return Config.ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS
  }
}

const useRootchainTracker = ({ name: walletName }, cleanup) => {
  const [pendingRootchainTxs, setUnconfirmedRootchainTxs] = useState([])

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

  const waitForConfirmation = useCallback(async () => {
    const pendingTx = pendingRootchainTxs.slice(-1).pop()
    const receipt = await Wait.waitForRootchainTransaction({
      hash: pendingTx.hash,
      intervalMs: 3000,
      confirmationThreshold: getConfirmationsThreshold(pendingTx),
      onCountdown: remaining =>
        console.log(`Confirmation is remaining by ${remaining} blocks`)
    })
    if (receipt) {
      return {
        ...pendingTx,
        rootchainBlknum: receipt.blockNumber,
        gasUsed: receipt.gasUsed
      }
    }
  }, [buildNotification, pendingRootchainTxs])

  const addExitTimeIfNeeded = useCallback(async tx => {
    if (tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT) {
      const {
        scheduledFinalizationTime: exitableAt
      } = await Plasma.getExitTime(tx.rootchainBlknum, tx.blknum)
      return { ...tx, exitableAt }
    } else {
      return tx
    }
  }, [])

  useEffect(() => {
    let subscribed = true

    if (subscribed && pendingRootchainTxs.length) {
      waitForConfirmation()
        .then(payload => subscribed && addExitTimeIfNeeded(payload))
        .then(async tx => {
          if (!subscribed) return

          const notificationPayload = await buildNotification(tx)
          notificationService.sendNotification(notificationPayload)

          setUnconfirmedRootchainTxs([])
          cleanup(tx)
        })
    }

    return () => (subscribed = false)
  }, [pendingRootchainTxs])

  return [setUnconfirmedRootchainTxs]
}

export default useRootchainTracker
