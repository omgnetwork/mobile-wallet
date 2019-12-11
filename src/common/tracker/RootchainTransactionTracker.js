import { useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { TransactionActionTypes } from 'common/constants'
import { useRootchainTracker } from 'common/hooks'
import { Transaction, Datetime } from 'common/utils'
import { walletActions, transactionActions } from 'common/actions'
import { notificationService } from 'common/services'

const RootchainTransactionTracker = ({
  wallet,
  pendingTxs,
  dispatchAddStartedExitTx,
  dispatchInvalidatePendingTx,
  dispatchRefreshRootchain,
  dispatchRefreshAll
}) => {
  const primaryWallet = useRef(wallet)
  const [
    rootNotification,
    setRootNotification,
    setRootchainTxs
  ] = useRootchainTracker(primaryWallet)

  useEffect(() => {
    if (rootNotification) {
      const confirmedTx = pendingTxs.find(
        tx => tx.hash === rootNotification.confirmedTxs[0].hash
      )

      if (!confirmedTx) {
        return
      }

      if (Transaction.isUnconfirmStartedExitTx(confirmedTx)) {
        dispatchAddStartedExitTx({
          ...confirmedTx,
          startedExitAt: Datetime.now()
        })
      }

      dispatchInvalidatePendingTx(confirmedTx)

      notificationService.sendNotification(rootNotification)

      setRootNotification(null)

      switch (rootNotification.type) {
        case 'rootchain':
          return dispatchRefreshRootchain(primaryWallet.current.address)
        case 'all':
          return dispatchRefreshAll(primaryWallet.current.address)
        default:
          return dispatchRefreshAll(primaryWallet.current.address)
      }
    }
  }, [
    rootNotification,
    dispatchInvalidatePendingTx,
    dispatchRefreshRootchain,
    primaryWallet,
    dispatchRefreshAll,
    pendingTxs,
    dispatchAddStartedExitTx,
    setRootNotification
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

  useEffect(() => {
    primaryWallet.current = wallet
  }, [wallet])

  useEffect(() => {
    if (primaryWallet.current) {
      const rootTxs = getRootTxs()
      setRootchainTxs(rootTxs)
    } else {
      setRootchainTxs([])
    }
  }, [getRootTxs, pendingTxs, primaryWallet, setRootchainTxs])

  return null
}

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
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
  dispatchRefreshAll: address =>
    walletActions.refreshAll(dispatch, address, true)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootchainTransactionTracker)
