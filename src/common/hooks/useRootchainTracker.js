import { useEffect, useCallback, useState } from 'react'
import { TransactionActionTypes } from 'common/constants'
import Config from 'react-native-config'
import { ethereumService } from 'common/services'
import BackgroundTimer from 'react-native-background-timer'
import { NotificationMessages } from 'common/constants'

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

  const syncTransactions = useCallback(() => {
    return ethereumService.getTxs(wallet.current.address, '0')
  }, [wallet])

  const verify = useCallback(
    currentRootchainTxs => {
      const currentRootchainTxsHash = currentRootchainTxs.map(tx => tx.hash)
      const resolvedUnconfirmedTxs = pendingRootchainTxs.filter(
        unconfirmedTx =>
          currentRootchainTxsHash.indexOf(unconfirmedTx.hash) > -1
      )

      if (resolvedUnconfirmedTxs.length) {
        const completedTxs = resolvedUnconfirmedTxs.filter(unconfirmedTx => {
          const rootchainTx = currentRootchainTxs.find(
            tx => tx.hash === unconfirmedTx.hash
          )
          const confirmationsThreshold = getConfirmationsThreshold(
            unconfirmedTx
          )

          const confirmations = Number(rootchainTx.confirmations)

          console.log(confirmations)

          const hasEnoughConfimations = confirmations >= confirmationsThreshold

          console.log('have enough confirmations yet?', hasEnoughConfimations)
          return hasEnoughConfimations
        })
        return completedTxs
      } else {
        return false
      }
    },
    [pendingRootchainTxs]
  )

  const buildNotification = useCallback(
    confirmedTx => {
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
        return {
          ...NotificationMessages.NOTIFY_TRANSACTION_START_STANDARD_EXITED(
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
    if (!pendingRootchainTxs.length) return
    const currentRootchainTxs = await syncTransactions()
    const confirmedTxs = verify(currentRootchainTxs)
    if (confirmedTxs && confirmedTxs.length) {
      const notificationPayloads = confirmedTxs.map(confirmedTx =>
        buildNotification(confirmedTx)
      )

      const confirmedTxHashes = confirmedTxs.map(tx => tx.hash)
      notificationPayloads.forEach(payload => {
        setNotification(payload)
        setUnconfirmedRootchainTxs(
          pendingRootchainTxs.filter(
            tx => confirmedTxHashes.indexOf(tx.hash) === -1
          )
        )
      })
    }
  }, [buildNotification, pendingRootchainTxs, syncTransactions, verify])

  useEffect(() => {
    let intervalId
    if (pendingRootchainTxs.length) {
      intervalId = BackgroundTimer.setInterval(() => {
        track()
      }, 5000)
    }

    return () => {
      if (intervalId) {
        BackgroundTimer.clearInterval(intervalId)
      }
    }
  }, [pendingRootchainTxs, track])

  return [notification, setNotification, setUnconfirmedRootchainTxs]
}

export default useRootchainTracker
