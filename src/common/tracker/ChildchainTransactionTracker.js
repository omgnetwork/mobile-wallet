import { useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { TransactionActionTypes } from 'common/constants'
import { useChildchainTracker } from 'common/hooks'
import { walletActions, transactionActions } from 'common/actions'
import { notificationService } from 'common/services'

const ChildchainTransactionTracker = ({
  wallet,
  pendingTxs,
  dispatchInvalidatePendingTx,
  dispatchRefreshChildchain
}) => {
  const primaryWallet = useRef(wallet)
  const [
    childNotification,
    setChildNotification,
    setChildchainTxs
  ] = useChildchainTracker(primaryWallet)
  useEffect(() => {
    if (childNotification) {
      const confirmedTx = pendingTxs.find(
        tx => tx.hash === childNotification.confirmedTxs[0].hash
      )

      if (!confirmedTx) {
        return
      }

      dispatchInvalidatePendingTx(confirmedTx)

      notificationService.sendNotification(childNotification)

      setChildNotification(null)

      return dispatchRefreshChildchain(primaryWallet.current.address)
    }
  }, [
    childNotification,
    dispatchInvalidatePendingTx,
    dispatchRefreshChildchain,
    pendingTxs,
    setChildNotification
  ])

  const filterTxs = useCallback(filterFunc => pendingTxs.filter(filterFunc), [
    pendingTxs
  ])

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
      const childTxs = getChildTxs()
      setChildchainTxs(childTxs)
    } else {
      setChildchainTxs([])
    }
  }, [getChildTxs, setChildchainTxs])

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
  dispatchInvalidatePendingTx: resolvedPendingTx =>
    transactionActions.invalidatePendingTx(dispatch, resolvedPendingTx),
  dispatchRefreshChildchain: address =>
    walletActions.refreshChildchain(dispatch, address, true)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChildchainTransactionTracker)
