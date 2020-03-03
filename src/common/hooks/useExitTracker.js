import { useState, useEffect, useCallback } from 'react'
import { Datetime } from 'common/utils'
import { NotificationMessages, ExitStatus } from 'common/constants'
import BackgroundTimer from 'react-native-background-timer'

const useExitTracker = blockchainWallet => {
  const INTERVAL_PERIOD = 15000
  const [startedExitTxs, setStartedExitTxs] = useState([])
  const [notification, setNotification] = useState(null)

  const getExitReadyTxs = useCallback(() => {
    return startedExitTxs.filter(tx => {
      const currentDatetime = Datetime.fromNow()
      const exitableAt = Datetime.fromTimestamp(tx.exitableAt)
      return currentDatetime.isSameOrAfter(exitableAt)
    })
  }, [startedExitTxs])

  const updateTransactionStatus = useCallback(() => {
    const readyToExitTxs = getExitReadyTxs()
    return readyToExitTxs.map(tx => {
      return {
        ...tx,
        status: ExitStatus.EXIT_READY
      }
    })
  }, [getExitReadyTxs])

  const verify = useCallback(exitedTxs => {
    return exitedTxs.length > 0
  }, [])

  const buildNotification = useCallback(txs => {
    return {
      ...NotificationMessages.NOTIFY_TRANSACTION_READY_TO_PROCESS_EXITED(
        txs[0].value,
        txs[0].symbol
      ),
      type: 'exit',
      confirmedTxs: txs
    }
  }, [])

  const track = useCallback(async () => {
    const updatedTxs = updateTransactionStatus()
    if (verify(updatedTxs)) {
      const notificationPayload = buildNotification(updatedTxs)
      setNotification(notificationPayload)
    }
  }, [buildNotification, updateTransactionStatus, verify])

  useEffect(() => {
    let intervalId
    if (startedExitTxs.length) {
      intervalId = BackgroundTimer.setInterval(() => {
        track()
      }, INTERVAL_PERIOD)
      track()
    }

    return () => {
      if (intervalId) {
        BackgroundTimer.clearInterval(intervalId)
      }
    }
  }, [INTERVAL_PERIOD, startedExitTxs, track])

  return [notification, setNotification, setStartedExitTxs]
}

export default useExitTracker
