import { useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { TransactionActionTypes } from 'common/constants'
import { useRootchainTracker } from 'common/hooks'
import { Transaction } from 'common/blockchain'
import { walletActions, transactionActions } from 'common/actions'

const { TYPE_CHILDCHAIN_SEND_TOKEN } = TransactionActionTypes

const RootchainTransactionTracker = ({
  wallet,
  unconfirmedTxs,
  dispatchUpdateBlocksToWait,
  dispatchAddStartedExitTx,
  dispatchInvalidateUnconfirmedTx,
  dispatchRefreshAll
}) => {
  if (!wallet) return null

  const cleanup = useCallback(tx => {
    if (Transaction.isUnconfirmStartedExit(tx)) {
      dispatchAddStartedExitTx(tx)
    }

    dispatchInvalidateUnconfirmedTx(tx)
    dispatchRefreshAll(wallet.address)
  }, [])

  const [setPendingTx] = useRootchainTracker(
    wallet,
    dispatchUpdateBlocksToWait,
    cleanup
  )

  useEffect(() => {
    if (unconfirmedTxs.length === 0) {
      return setPendingTx(null)
    }

    const pendingTx = unconfirmedTxs[0]

    if (pendingTx.actionType !== TYPE_CHILDCHAIN_SEND_TOKEN) {
      setPendingTx(pendingTx)
    }
  }, [unconfirmedTxs])

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
    walletActions.refreshAll(dispatch, address, true),
  dispatchUpdateBlocksToWait: (tx, blocksToWait) =>
    transactionActions.updateBlocksToWait(dispatch, tx, blocksToWait)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootchainTransactionTracker)
