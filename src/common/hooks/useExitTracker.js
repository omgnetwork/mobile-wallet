import { useState, useEffect, useCallback } from 'react'
import { Datetime } from 'common/utils'
import Config from 'react-native-config'
import { NotificationMessages } from 'common/constants'
import BackgroundTimer from 'react-native-background-timer'

const useExitTracker = blockchainWallet => {
  const EXIT_PERIOD = Config.EXIT_PERIOD * 2
  const INTERVAL_PERIOD = 60000
  const [startedExitTxs, setStartedExitTxs] = useState([])
  const [notification, setNotification] = useState(null)

  const getExitReadyTxs = useCallback(() => {
    return startedExitTxs.filter(tx => {
      const currentDatetime = Datetime.fromNow()
      const startedExitAt = Datetime.fromString(tx.startedExitAt)
      const exitableAt = Datetime.add(startedExitAt, EXIT_PERIOD)
      return currentDatetime.isSameOrAfter(exitableAt)
    })
  }, [EXIT_PERIOD, startedExitTxs])

  // const processExit = useCallback(async () => {
  //   const readyExitTxs = getExitReadyTxs()
  //   const pendingProcessExits = readyExitTxs.map(tx => {
  //     return plasmaService.processExits(
  //       blockchainWallet,
  //       tx.exitId,
  //       tx.contractAddress
  //     )
  //   })

  //   if (pendingProcessExits.length) {
  //     const receipts = await Promise.all(pendingProcessExits)
  //     return readyExitTxs
  //   }
  //   return []
  // }, [blockchainWallet, getExitReadyTxs])

  const updateTransactionStatus = useCallback(() => {
    const readyToExitTxs = getExitReadyTxs()
    return readyToExitTxs.map(tx => {
      return {
        ...tx,
        status: 'ready'
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
