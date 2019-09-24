import { useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { Platform } from 'react-native'
import { TransactionTypes } from 'common/constants'
import { useRootchainTracker, useChildchainTracker } from 'common/hooks'
import { walletActions, transactionActions } from 'common/actions'
import { notificationService } from 'common/services'
import BackgroundTimer from 'react-native-background-timer'

const TransactionTracker = ({
  wallet,
  pendingTxs,
  dispatchInvalidatePendingTx,
  dispatchRefreshRootchain,
  dispatchRefreshChildchain,
  dispatchRefreshAll
}) => {
  const [rootNotification, setRootchainTxs] = useRootchainTracker(wallet)
  const [childNotification, setChildchainTxs] = useChildchainTracker(wallet)

  const primaryWallet = useRef(wallet)

  useEffect(() => {
    const notification = rootNotification || childNotification
    if (notification) {
      notificationService.sendNotification(notification)
      dispatchInvalidatePendingTx(notification.confirmedTx)
      switch (notification.type) {
        case 'childchain':
          return dispatchRefreshChildchain(wallet.address)
        case 'rootchain':
          return dispatchRefreshRootchain(wallet.address)
        case 'all':
          return dispatchRefreshAll(wallet.address)
        default:
          return dispatchRefreshAll(wallet.address)
      }
    }
  }, [
    rootNotification,
    childNotification,
    dispatchInvalidatePendingTx,
    dispatchRefreshRootchain,
    wallet.address,
    dispatchRefreshChildchain,
    dispatchRefreshAll
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
    } else {
      setRootchainTxs([])
      setChildchainTxs([])
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
    setRootchainTxs
  ])

  return null
}

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  pendingTxs: state.transaction.pendingTxs
})

const mapDispatchToProps = (dispatch, ownProps) => ({
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
