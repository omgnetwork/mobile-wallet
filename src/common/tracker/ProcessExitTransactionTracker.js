import { useEffect, useRef, useCallback } from 'react'
import { Platform } from 'react-native'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import { useExitTracker } from 'common/hooks'
import { Transaction } from 'common/utils'
import { transactionActions } from 'common/actions'
import { notificationService } from 'common/services'
import { TaskScheduler } from 'common/native'

const ProcessExitTransactionTracker = ({
  wallet,
  blockchainWallet,
  startedExitTxs,
  dispatchUpdateStartedExitTxStatus
}) => {
  const primaryWallet = useRef(wallet)
  const [
    exitNotification,
    setExitNotification,
    setStartedExitTxs
  ] = useExitTracker(blockchainWallet)

  const getConfirmedStartedExitTxs = useCallback(() => {
    return startedExitTxs.filter(Transaction.isConfirmedStartedExitTx)
  }, [startedExitTxs])

  useEffect(() => {
    if (exitNotification) {
      exitNotification.confirmedTxs.forEach(tx => {
        if (Transaction.isReadyToProcessExitTx(tx)) {
          dispatchUpdateStartedExitTxStatus(tx)
        }
      })

      notificationService.sendNotification(exitNotification)

      setExitNotification(null)
    }
  }, [dispatchUpdateStartedExitTxStatus, exitNotification, setExitNotification])

  useEffect(() => {
    primaryWallet.current = wallet
  }, [wallet])

  useEffect(() => {
    if (primaryWallet.current) {
      const confirmedStartedExitTxs = getConfirmedStartedExitTxs()
      if (Platform.OS === 'android') {
        for (const { hash } of confirmedStartedExitTxs) {
          TaskScheduler.bookTask(
            hash,
            'HeadlessProcessExit',
            Config.EXIT_PERIOD * 2
          )
        }
      } else {
        setStartedExitTxs(confirmedStartedExitTxs)
      }
    } else {
      setStartedExitTxs([])
    }
  }, [getConfirmedStartedExitTxs, setStartedExitTxs])

  return null
}

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  blockchainWallet: state.setting.blockchainWallet,
  startedExitTxs: state.transaction.startedExitTxs
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchUpdateStartedExitTxStatus: tx =>
    transactionActions.updateStartedExitTxStatus(dispatch, tx.hash, tx.status)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProcessExitTransactionTracker)