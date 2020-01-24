import { useState, useEffect, useCallback } from 'react'
import { plasmaService } from 'common/services'
import { NotificationMessages } from 'common/constants'
import BackgroundTimer from 'react-native-background-timer'

const useChildchainTracker = wallet => {
  const [unconfirmedChildchainTxs, setUnconfirmedChildchainTxs] = useState([])
  const [notification, setNotification] = useState(null)

  const syncTransactions = useCallback(() => {
    return plasmaService.getTxs(wallet.current.address)
  }, [wallet])

  const verify = useCallback(
    currentWatcherTxs => {
      // console.log(currentWatcherTxs)
      const latestUnconfirmedTx = unconfirmedChildchainTxs.slice(-1).pop()
      const confirmedTx = currentWatcherTxs.find(
        tx => latestUnconfirmedTx.hash === tx.hash
      )

      console.log('have found yet?', confirmedTx !== undefined)

      return unconfirmedChildchainTxs.find(tx => tx.hash === confirmedTx.hash)
    },
    [unconfirmedChildchainTxs]
  )

  const buildNotification = useCallback(
    confirmedTx => {
      return {
        ...NotificationMessages.NOTIFY_TRANSACTION_SENT_OMG_NETWORK(
          wallet.current.name,
          confirmedTx.value,
          confirmedTx.symbol
        ),
        type: 'childchain',
        confirmedTxs: [confirmedTx]
      }
    },
    [wallet]
  )

  const track = useCallback(async () => {
    const currentWatcherTxs = await syncTransactions()
    const confirmedTx = verify(currentWatcherTxs)
    if (confirmedTx) {
      const notificationPayload = buildNotification(confirmedTx)
      setNotification(notificationPayload)
    }
  }, [buildNotification, syncTransactions, verify])

  useEffect(() => {
    let intervalId
    if (unconfirmedChildchainTxs.length) {
      intervalId = BackgroundTimer.setInterval(() => {
        track()
      }, 5000)
    }

    return () => {
      if (intervalId) {
        BackgroundTimer.clearInterval(intervalId)
      }
    }
  }, [unconfirmedChildchainTxs, track])

  return [notification, setNotification, setUnconfirmedChildchainTxs]
}

export default useChildchainTracker
