import { useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { TransactionActionTypes } from 'common/constants'
import { useChildchainTracker } from 'common/hooks'
import { walletActions, transactionActions } from 'common/actions'
import { notificationService } from 'common/services'

const ChildchainTransactionTracker = ({
  wallet,
  unconfirmedTxs,
  dispatchInvalidateUnconfirmedTx,
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
      const confirmedTx = unconfirmedTxs.find(
        tx => tx.hash === childNotification.confirmedTxs[0].hash
      )

      if (!confirmedTx) {
        return
      }

      dispatchInvalidateUnconfirmedTx(confirmedTx)

      notificationService.sendNotification(childNotification)

      setChildNotification(null)

      return dispatchRefreshChildchain(primaryWallet.current.address)
    }
  }, [
    childNotification,
    dispatchInvalidateUnconfirmedTx,
    dispatchRefreshChildchain,
    unconfirmedTxs,
    setChildNotification
  ])

  const filterTxs = useCallback(filterFunc => unconfirmedTxs.filter(filterFunc), [
    unconfirmedTxs
  ])

  const getChildTxs = useCallback(() => {
    return filterTxs(
      unconfirmedTx =>
        unconfirmedTx.actionType ===
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
  unconfirmedTxs: state.transaction.unconfirmedTxs
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchInvalidateUnconfirmedTx: resolvedUnconfirmedTx =>
    transactionActions.invalidateUnconfirmedTx(dispatch, resolvedUnconfirmedTx),
  dispatchRefreshChildchain: address =>
    walletActions.refreshChildchain(dispatch, address, true)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChildchainTransactionTracker)
