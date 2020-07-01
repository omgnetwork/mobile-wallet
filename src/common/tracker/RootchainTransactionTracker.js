import { useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { TransactionActionTypes } from 'common/constants'
import { useRootchainTracker } from 'common/hooks'
import { Transaction } from 'common/blockchain'
import { walletActions, transactionActions } from 'common/actions'
import { notificationService } from 'common/services'

const RootchainTransactionTracker = ({
  wallet,
  unconfirmedTxs,
  dispatchAddStartedExitTx,
  dispatchInvalidateUnconfirmedTx,
  dispatchRefreshRootchain,
  dispatchRefreshAll
}) => {
  const primaryWallet = useRef(wallet)
  const [
    rootNotification,
    setRootNotification,
    setRootchainTxs
  ] = useRootchainTracker(primaryWallet)
  const invalidatedTxs = useRef([])

  useEffect(() => {
    if (rootNotification) {
      const confirmedTx = rootNotification.confirmedTxs.slice(-1).pop()
      const hasInvalidated = invalidatedTxs.current.includes(confirmedTx.hash)
      if (!confirmedTx && hasInvalidated) {
        return
      }

      if (Transaction.isUnconfirmStartedExit(confirmedTx)) {
        dispatchAddStartedExitTx({
          ...confirmedTx
        })
      }

      dispatchInvalidateUnconfirmedTx(confirmedTx)
      invalidatedTxs.current = [...invalidatedTxs.current, confirmedTx.hash]

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
    dispatchInvalidateUnconfirmedTx,
    dispatchRefreshRootchain,
    primaryWallet,
    dispatchRefreshAll,
    dispatchAddStartedExitTx,
    setRootNotification
  ])

  useEffect(() => {
    if (rootNotification) {
      // notificationService.sendNotification(rootNotification)
      setRootNotification(null)
    }
  }, [rootNotification])

  const filterTxs = useCallback(
    filterFunc => unconfirmedTxs.filter(filterFunc),
    [unconfirmedTxs]
  )

  const getRootTxs = useCallback(() => {
    return filterTxs(
      unconfirmedTx =>
        unconfirmedTx.actionType !==
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
  }, [getRootTxs, unconfirmedTxs, primaryWallet, setRootchainTxs])

  return null
}

const mapStateToProps = (state, _ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  provider: state.setting.provider,
  unconfirmedTxs: state.transaction.unconfirmedTxs
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchAddStartedExitTx: tx =>
    transactionActions.addStartedExitTx(dispatch, tx),
  dispatchInvalidateUnconfirmedTx: confirmedTx =>
    transactionActions.invalidateUnconfirmedTx(dispatch, confirmedTx),
  dispatchRefreshRootchain: address =>
    walletActions.refreshRootchain(dispatch, address, true),
  dispatchRefreshAll: address =>
    walletActions.refreshAll(dispatch, address, true)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootchainTransactionTracker)
