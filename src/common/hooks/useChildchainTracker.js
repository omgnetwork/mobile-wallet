import { useState, useEffect, useCallback } from 'react'
import { plasmaService } from 'common/services'
import BackgroundTimer from 'react-native-background-timer'

const useChildchainTracker = wallet => {
  const [pendingChildchainTxs, setPendingChildchainTxs] = useState([])
  const [notification, setNotification] = useState(null)

  const syncTransactions = useCallback(() => {
    return plasmaService.getTxs(wallet.address)
  }, [wallet.address])

  const verify = useCallback(
    currentWatcherTxs => {
      const pendingTxsHash = pendingChildchainTxs.map(
        pendingTx => pendingTx.hash
      )
      const resolvedPendingTx = currentWatcherTxs.find(
        tx => pendingTxsHash.indexOf(tx.hash) > -1
      )

      console.log('have found yet?', resolvedPendingTx !== undefined)

      return pendingChildchainTxs.find(tx => tx.hash === resolvedPendingTx.hash)
    },
    [pendingChildchainTxs]
  )

  const buildNotification = useCallback(
    confirmedTx => {
      return {
        type: 'childchain',
        title: `${wallet.name} sent on OmiseGO network`,
        message: `${confirmedTx.value} ${confirmedTx.symbol}`,
        confirmedTx
      }
    },
    [wallet.name]
  )

  const track = useCallback(async () => {
    const currentWatcherTxs = await syncTransactions()
    console.log(currentWatcherTxs)
    const confirmedTx = verify(currentWatcherTxs)
    console.log('which one?', confirmedTx)
    if (confirmedTx) {
      const notificationPayload = buildNotification(confirmedTx)
      setNotification(notificationPayload)
    }
  }, [buildNotification, syncTransactions, verify])

  useEffect(() => {
    let intervalId
    if (pendingChildchainTxs.length) {
      intervalId = BackgroundTimer.setInterval(() => {
        track()
      }, 5000)
    }

    return () => {
      if (intervalId) {
        BackgroundTimer.clearInterval(intervalId)
      }
    }
  }, [pendingChildchainTxs, track])

  return [notification, setPendingChildchainTxs]
}

export default useChildchainTracker
