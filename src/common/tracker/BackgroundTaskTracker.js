import { useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import BackgroundTimer from 'react-native-background-timer'

const BackgroundTaskTracker = ({ wallet, pendingTxs, startedExitTxs }) => {
  const primaryWallet = useRef(wallet)
  const isStarted = useRef(false)
  const startBackgroundTimer = useCallback(() => {
    if (!isStarted.current) {
      BackgroundTimer.start()
    }
  }, [])

  const stopBackgroundTimer = useCallback(() => {
    if (isStarted.current) {
      BackgroundTimer.stop()
    }
  }, [])

  const hasInProgressTransaction = useCallback(() => {
    return pendingTxs.length + startedExitTxs.length > 0
  }, [pendingTxs, startedExitTxs])

  useEffect(() => {
    primaryWallet.current = wallet
  }, [wallet])

  useEffect(() => {
    if (primaryWallet.current && hasInProgressTransaction()) {
      startBackgroundTimer()
      isStarted.current = true
    } else {
      stopBackgroundTimer()
      isStarted.current = false
    }
    return stopBackgroundTimer
  }, [hasInProgressTransaction, startBackgroundTimer, stopBackgroundTimer])

  return null
}

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  pendingTxs: state.transaction.pendingTxs,
  startedExitTxs: state.transaction.startedExitTxs
})

export default connect(
  mapStateToProps,
  null
)(BackgroundTaskTracker)
