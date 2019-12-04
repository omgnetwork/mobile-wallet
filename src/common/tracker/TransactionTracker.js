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
  dispatchAddStartedExitTx,
  dispatchInvalidatePendingTx,
  dispatchRefreshRootchain,
  dispatchRefreshChildchain,
  dispatchRefreshAll
}) => {
  const primaryWallet = useRef(wallet)
  const [rootNotification, setRootchainTxs] = useRootchainTracker(primaryWallet)
  const [childNotification, setChildchainTxs] = useChildchainTracker(
    primaryWallet
  )

  useEffect(() => {
    const notification = rootNotification || childNotification
    if (notification) {
      const confirmedTx = pendingTxs.find(
        tx => tx.hash === notification.confirmedTx.hash
      )

      if (!confirmedTx) {
        return
      }

      if (Transaction.isExitTx(confirmedTx)) {
        dispatchAddStartedExitTx({
          ...confirmedTx,
          startedExitAt: Datetime.now()
        })
      }

      dispatchInvalidatePendingTx(confirmedTx)
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
    dispatchAddStartedExitTx
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
  blockchainWallet: state.setting.blockchainWallet,
  provider: state.setting.provider,
  pendingTxs: state.transaction.pendingTxs
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchAddStartedExitTx: tx =>
    transactionActions.addStartedExitTx(dispatch, tx),
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
