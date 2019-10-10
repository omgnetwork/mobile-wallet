import { useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { Platform } from 'react-native'
import { TransactionTypes } from 'common/constants'
import {
  useRootchainTracker,
  useChildchainTracker,
  useExitTracker
} from 'common/hooks'
import { walletActions, transactionActions } from 'common/actions'
import { notificationService, walletService } from 'common/services'
import BackgroundTimer from 'react-native-background-timer'

const TransactionTracker = ({
  wallet,
  blockchainWallet,
  pendingTxs,
  pendingExits,
  dispatchInvalidatePendingTx,
  dispatchInvalidatePendingExitTx,
  dispatchRefreshRootchain,
  dispatchRefreshChildchain,
  dispatchRefreshAll
}) => {
  const primaryWallet = useRef(wallet)
  const [rootNotification, setRootchainTxs] = useRootchainTracker(primaryWallet)
  const [childNotification, setChildchainTxs] = useChildchainTracker(
    primaryWallet
  )
  const [exitNotification, setExitTxs] = useExitTracker(blockchainWallet)

  useEffect(() => {
    const notification =
      rootNotification || childNotification || exitNotification
    if (notification) {
      if (!pendingTxs.find(tx => tx.hash === notification.confirmedTx.hash)) {
        return
      }

      if (notification.type === 'exit') {
        dispatchInvalidatePendingExitTx(notification.confirmedTx)
      } else {
        dispatchInvalidatePendingTx(notification.confirmedTx)
      }
      notificationService.sendNotification(notification)

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
    dispatchInvalidatePendingExitTx,
    exitNotification
  ])

  const filterTxs = useCallback(filterFunc => pendingTxs.filter(filterFunc), [
    pendingTxs
  ])

  const getRootTxs = useCallback(() => {
    return filterTxs(
      pendingTx =>
        pendingTx.type !== TransactionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
    )
  }, [filterTxs])

  const getChildTxs = useCallback(() => {
    return filterTxs(
      pendingTx =>
        pendingTx.type === TransactionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
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
      setExitTxs(pendingExits)
    } else {
      setRootchainTxs([])
      setChildchainTxs([])
      setExitTxs([])
    }
    return () => {
      if (Platform.OS === 'ios') {
        BackgroundTimer.stop()
      }
    }
  }, [
    getChildTxs,
    getRootTxs,
    pendingExits,
    pendingTxs,
    primaryWallet,
    setChildchainTxs,
    setExitTxs,
    setRootchainTxs
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
  pendingExits: state.transaction.pendingExits
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchInvalidatePendingTx: resolvedPendingTx =>
    transactionActions.invalidatePendingTx(dispatch, resolvedPendingTx),
  dispatchInvalidatePendingExitTx: resolvedPendingTx =>
    transactionActions.invalidatePendingExitTx(dispatch, resolvedPendingTx),
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
