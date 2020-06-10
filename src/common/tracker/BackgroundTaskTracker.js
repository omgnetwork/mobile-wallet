import { useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import BackgroundTimer from 'react-native-background-timer'

const BackgroundTaskTracker = ({ wallet, unconfirmedTxs, startedExitTxs }) => {
  const primaryWallet = useRef(wallet)
  const isStarted = useRef(false)
  const startBackgroundTimer = useCallback(() => {
    if (!isStarted.current) {
      BackgroundTimer.start()
      isStarted.current = true
    }
  }, [])

  const stopBackgroundTimer = useCallback(() => {
    if (isStarted.current) {
      BackgroundTimer.stop()
      isStarted.current = false
    }
  }, [])

  const hasInProgressTransaction = useCallback(() => {
    return unconfirmedTxs.length + startedExitTxs.length > 0
  }, [unconfirmedTxs, startedExitTxs])

  useEffect(() => {
    primaryWallet.current = wallet
  }, [wallet])

  useEffect(() => {
    if (primaryWallet.current && hasInProgressTransaction()) {
      startBackgroundTimer()
    } else {
      stopBackgroundTimer()
    }
    return stopBackgroundTimer
  }, [hasInProgressTransaction, startBackgroundTimer, stopBackgroundTimer])

  return null
}

const mapStateToProps = (state, _ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  unconfirmedTxs: state.transaction.unconfirmedTxs,
  startedExitTxs: state.transaction.startedExitTxs
})

export default connect(mapStateToProps, null)(BackgroundTaskTracker)
