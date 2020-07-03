import { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { TransactionActionTypes } from 'common/constants'
import { useRootchainTracker } from 'common/hooks'
import { Transaction } from 'common/blockchain'
import { walletActions, transactionActions } from 'common/actions'

const RootchainTransactionTracker = ({
  wallet,
  unconfirmedTxs,
  dispatchAddStartedExitTx,
  dispatchInvalidateUnconfirmedTx,
  dispatchRefreshAll
}) => {
  const cleanup = useCallback(tx => {
    if (Transaction.isUnconfirmStartedExit(tx)) {
      dispatchAddStartedExitTx(tx)
    }

    dispatchInvalidateUnconfirmedTx(tx)
    dispatchRefreshAll(wallet.address)
  }, [])

  const [setUnconfirmedTxs] = useRootchainTracker(wallet, cleanup)

  useEffect(() => {
    if (wallet) {
      const txs = unconfirmedTxs.filter(
        unconfirmedTx =>
          unconfirmedTx.actionType !==
          TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
      )
      setUnconfirmedTxs(txs)
    } else {
      setUnconfirmedTxs([])
    }
  }, [wallet, setUnconfirmedTxs, unconfirmedTxs])

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
  dispatchRefreshAll: address =>
    walletActions.refreshAll(dispatch, address, true)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootchainTransactionTracker)
