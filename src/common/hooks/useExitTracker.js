import { useState, useEffect, useCallback, useRef } from 'react'
import { plasmaService } from 'common/services'
import { Datetime } from 'common/utils'
import Config from 'react-native-config'
import BackgroundTimer from 'react-native-background-timer'

const useExitTracker = blockchainWallet => {
  // const INTERVAL_PERIOD = Config.EXIT_PERIOD / 2 + 5000
  const INTERVAL_PERIOD = 20000
  const [pendingExitTxs, setPendingExitTxs] = useState([])
  const watchedExitTxs = useRef([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    watchedExitTxs.current = pendingExitTxs
  }, [pendingExitTxs])

  const getExitReadyTxs = () => {
    return watchedExitTxs.current.filter(tx => {
      const currentDatetime = Datetime.fromNow()
      const createdAt = Datetime.fromString(tx.createdAt)
      const exitableAt = Datetime.add(createdAt, Config.EXIT_PERIOD)
      console.log('current datetime', currentDatetime.format())
      console.log('exitable At', exitableAt.format())
      console.log('exitable', currentDatetime.isSameOrAfter(exitableAt))
      return currentDatetime.isSameOrAfter(exitableAt)
    })
  }

  const processExit = useCallback(async () => {
    const readyExitTxs = getExitReadyTxs()
    const pendingProcessExits = readyExitTxs.map(tx => {
      return plasmaService.processExits(
        blockchainWallet,
        tx.exitId,
        tx.contractAddress
      )
    })

    console.log('readyExitTxs', readyExitTxs)

    if (pendingProcessExits.length) {
      console.log('processing...')
      const receipts = await Promise.all(pendingProcessExits)
      console.log(receipts)
      return readyExitTxs
    }
    return []
  }, [blockchainWallet])

  const verify = useCallback(exitedTxs => {
    return exitedTxs.length > 0
  }, [])

  const buildNotification = useCallback(tx => {
    return {
      type: 'exit',
      title: `Successfully exited from OmiseGO network`,
      message: `${tx.value} ${tx.symbol}`,
      confirmedTx: tx
    }
  }, [])

  const track = useCallback(async () => {
    const exitedTxs = await processExit()
    if (verify(exitedTxs)) {
      exitedTxs.forEach(tx => {
        const notificationPayload = buildNotification(tx)
        setNotification(notificationPayload)
      })
    }
  }, [buildNotification, processExit, verify])

  useEffect(() => {
    let intervalId
    if (pendingExitTxs.length) {
      intervalId = BackgroundTimer.setInterval(() => {
        console.log('track')
        track()
      }, INTERVAL_PERIOD)
    }

    return () => {
      if (intervalId) {
        BackgroundTimer.clearInterval(intervalId)
      }
    }
  }, [INTERVAL_PERIOD, pendingExitTxs, track])

  return [notification, setPendingExitTxs]
}

export default useExitTracker
