import { useEffect, useCallback, useState } from 'react'
import { TransactionActionTypes } from 'common/constants'
import Config from 'react-native-config'
import { ethereumService } from 'common/services'
import BackgroundTimer from 'react-native-background-timer'

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
  const [pendingRootchainTxs, setPendingRootchainTxs] = useState([])
  const [notification, setNotification] = useState(null)

  const syncTransactions = useCallback(() => {
    return ethereumService.getTxs(wallet.current.address, '0')
  }, [wallet])

  const verify = useCallback(
    currentRootchainTxs => {
      const currentRootchainTxsHash = currentRootchainTxs.map(tx => tx.hash)
      const resolvedPendingTxs = pendingRootchainTxs.filter(
        pendingTx => currentRootchainTxsHash.indexOf(pendingTx.hash) > -1
      )

      if (resolvedPendingTxs.length) {
        const completedTxs = resolvedPendingTxs.filter(pendingTx => {
          const rootchainTx = currentRootchainTxs.find(
            tx => tx.hash === pendingTx.hash
          )
          const confirmationsThreshold = getConfirmationsThreshold(pendingTx)

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
          type: 'all',
          title: `${wallet.current.name} deposited`,
          message: `${confirmedTx.value} ${confirmedTx.symbol}`,
          confirmedTx
        }
      } else if (
        confirmedTx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT
      ) {
        return {
          type: 'childchain',
          title: `${wallet.current.name} prepared to exit`,
          message: `${confirmedTx.value} ${confirmedTx.symbol}`,
          confirmedTx
        }
      } else {
        return {
          type: 'rootchain',
          title: `${wallet.current.name} sent on the Ethereum network`,
          message: `${confirmedTx.value} ${confirmedTx.symbol}`,
          confirmedTx
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
        setPendingRootchainTxs(
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

  return [notification, setPendingRootchainTxs]
}

export default useRootchainTracker
