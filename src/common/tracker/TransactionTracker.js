import { useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { Platform } from 'react-native'
import { TransactionActionTypes } from 'common/constants'
import {
  useRootchainTracker,
  useChildchainTracker,
  useExitTracker
} from 'common/hooks'
import { Transaction, Datetime } from 'common/utils'
import { walletActions, transactionActions } from 'common/actions'
import { notificationService } from 'common/services'
import BackgroundTimer from 'react-native-background-timer'

const TransactionTracker = ({
  wallet,
  blockchainWallet,
  pendingTxs,
  startedExitTxs,
  dispatchAddStartedExitTx,
  dispatchUpdateStartedExitTxStatus,
  dispatchInvalidatePendingTx,
  dispatchRefreshRootchain,
  dispatchRefreshChildchain,
  dispatchRefreshAll
}) => {
  const primaryWallet = useRef(wallet)
  const [
    rootNotification,
    setRootNotification,
    setRootchainTxs
  ] = useRootchainTracker(primaryWallet)
  const [
    childNotification,
    setChildNotification,
    setChildchainTxs
  ] = useChildchainTracker(primaryWallet)
  const [
    exitNotification,
    setExitNotification,
    setStartedExitTxs
  ] = useExitTracker(blockchainWallet)

  useEffect(() => {
    const notification =
      rootNotification || childNotification || exitNotification
    if (notification) {
      const confirmedTx =
        pendingTxs.find(tx => tx.hash === notification.confirmedTxs[0].hash) ||
        startedExitTxs.find(tx => tx.hash === notification.confirmedTxs[0].hash)

      if (!confirmedTx) {
        return
      }

      if (Transaction.isUnconfirmStartedExitTx(confirmedTx)) {
        dispatchAddStartedExitTx({
          ...confirmedTx,
          startedExitAt: Datetime.now()
        })
      }

      notification.confirmedTxs.forEach(tx => {
        if (Transaction.isReadyToProcessExitTx(tx)) {
          dispatchUpdateStartedExitTxStatus(tx)
        } else {
          dispatchInvalidatePendingTx(tx)
        }
      })

      notificationService.sendNotification(notification)

      setRootNotification(null)
      setChildNotification(null)
      setExitNotification(null)

      switch (notification.type) {
        case 'childchain':
          return dispatchRefreshChildchain(primaryWallet.current.address)
        case 'rootchain':
          return dispatchRefreshRootchain(primaryWallet.current.address)
        case 'exit':
          return dispatchRefreshAll(primaryWallet.current.address)
        case 'all':
          return dispatchRefreshAll(primaryWallet.current.address)
        default:
          return dispatchRefreshAll(primaryWallet.current.address)
      }
    }
  }, [
    rootNotification,
    childNotification,
    dispatchInvalidatePendingTx,
    dispatchRefreshRootchain,
    primaryWallet,
    dispatchRefreshChildchain,
    dispatchRefreshAll,
    pendingTxs,
    dispatchAddStartedExitTx,
    setRootNotification,
    setChildNotification,
    exitNotification,
    setExitNotification,
    dispatchUpdateStartedExitTxStatus,
    startedExitTxs
  ])

  const filterTxs = useCallback(filterFunc => pendingTxs.filter(filterFunc), [
    pendingTxs
  ])

  const getRootTxs = useCallback(() => {
    return filterTxs(
      pendingTx =>
        pendingTx.actionType !==
        TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
    )
  }, [filterTxs])

  const getChildTxs = useCallback(() => {
    return filterTxs(
      pendingTx =>
        pendingTx.actionType ===
        TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
    )
  }, [filterTxs])

  useEffect(() => {
    primaryWallet.current = wallet
  }, [wallet])

  useEffect(() => {
    if (primaryWallet.current) {
      const rootTxs = getRootTxs()
      const childTxs = getChildTxs()
      if (Platform.OS === 'ios') {
        BackgroundTimer.start()
      }

      setRootchainTxs(rootTxs)
      setChildchainTxs(childTxs)
      if (Platform.OS === 'ios') {
        const confirmedStartedExitTxs = startedExitTxs.filter(
          Transaction.isConfirmedStartedExitTx
        )
        console.log(confirmedStartedExitTxs)
        setStartedExitTxs(confirmedStartedExitTxs)
      }
    } else {
      setRootchainTxs([])
      setChildchainTxs([])
      if (Platform.OS === 'ios') {
        setStartedExitTxs([])
      }
    }
    return () => {
      if (Platform.OS === 'ios') {
        BackgroundTimer.stop()
      }
    }
  }, [
    getChildTxs,
    getRootTxs,
    pendingTxs,
    primaryWallet,
    setChildchainTxs,
    setRootchainTxs,
    setStartedExitTxs,
    startedExitTxs
  ])

  return null
}

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  blockchainWallet: state.setting.blockchainWallet,
  provider: state.setting.provider,
  pendingTxs: state.transaction.pendingTxs,
  startedExitTxs: state.transaction.startedExitTxs
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchAddStartedExitTx: tx =>
    transactionActions.addStartedExitTx(dispatch, tx),
  dispatchUpdateStartedExitTxStatus: tx =>
    transactionActions.updateStartedExitTxStatus(dispatch, tx.hash, tx.status),
  dispatchInvalidatePendingTx: resolvedPendingTx =>
    transactionActions.invalidatePendingTx(dispatch, resolvedPendingTx),
  dispatchRefreshRootchain: address =>
    walletActions.refreshRootchain(dispatch, address, true),
  dispatchRefreshChildchain: address =>
    walletActions.refreshChildchain(dispatch, address, true),
  dispatchRefreshAll: address =>
    walletActions.refreshAll(dispatch, address, true)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionTracker)
