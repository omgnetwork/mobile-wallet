import { useEffect, useCallback, useState } from 'react'
import { TransactionTypes } from 'common/constants'
import Config from 'react-native-config'
import { ethereumService } from 'common/services'
import BackgroundTimer from 'react-native-background-timer'

const getConfirmationsThreshold = tx => {
  if (tx.type === TransactionTypes.TYPE_CHILDCHAIN_DEPOSIT) {
    return Config.CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS
  } else if (tx.type === TransactionTypes.TYPE_CHILDCHAIN_EXIT) {
    return Config.CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS
  } else {
    return Config.ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS
  }
}

const useRootchainTracker = wallet => {
  const [pendingRootchainTxs, setPendingRootchainTxs] = useState([])
  const [notification, setNotification] = useState(null)

  const syncTransactions = useCallback(() => {
    return ethereumService.getTxs(wallet.address, wallet.updatedBlock)
  }, [wallet.address, wallet.updatedBlock])

  const verify = useCallback(
    currentRootchainTxs => {
      const pendingTxsHash = pendingRootchainTxs.map(
        pendingTx => pendingTx.hash
      )
      const resolvedPendingTx = currentRootchainTxs.find(
        tx => pendingTxsHash.indexOf(tx.hash) > -1
      )

      if (resolvedPendingTx) {
        const pendingTx = pendingRootchainTxs.find(
          tx => tx.hash === resolvedPendingTx.hash
        )

        const confirmationsThreshold = getConfirmationsThreshold(pendingTx)

        const confirmations = Number(resolvedPendingTx.confirmations)

        console.log(confirmations)

        const hasEnoughConfimations = confirmations >= confirmationsThreshold

        console.log('have enough confirmations yet?', hasEnoughConfimations)
        return hasEnoughConfimations && pendingTx
      } else {
        return false
      }
    },
    [pendingRootchainTxs]
  )

  const buildNotification = useCallback(
    confirmedTx => {
      if (confirmedTx.type === TransactionTypes.TYPE_CHILDCHAIN_DEPOSIT) {
        return {
          type: 'all',
          title: `${wallet.name} deposited`,
          message: `${confirmedTx.value} ${confirmedTx.symbol}`,
          confirmedTx
        }
      } else if (confirmedTx.type === TransactionTypes.TYPE_CHILDCHAIN_EXIT) {
        return {
          type: 'childchain',
          title: `${wallet.name} started to exit`,
          message: `${confirmedTx.value} ${confirmedTx.symbol}`,
          confirmedTx
        }
      } else {
        return {
          type: 'rootchain',
          title: `${wallet.name} sent on the Ethereum network`,
          message: `${confirmedTx.value} ${confirmedTx.symbol}`,
          confirmedTx
        }
      }
    },
    [wallet.name]
  )

  const track = useCallback(async () => {
    if (!pendingRootchainTxs.length) return
    const currentRootchainTxs = await syncTransactions()
    const confirmedTx = verify(currentRootchainTxs)
    if (confirmedTx) {
      const notificationPayload = buildNotification(confirmedTx)
      setNotification(notificationPayload)
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
