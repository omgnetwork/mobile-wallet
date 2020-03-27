import { useEffect } from 'react'
import { connect } from 'react-redux'
import { usePeriodicallyMerge } from 'common/hooks'
import { plasmaActions, transactionActions } from 'common/actions'

const MAXIMUM_UTXOS_PER_CURRENCY = 4

const MergeUtxosTracker = ({
  blockchainWallet,
  unconfirmedTxs,
  loading,
  dispatchMergeUtxosStatus,
  dispatchMergeUtxos
}) => {
  const lastBlknum = unconfirmedTxs?.slice(-1)?.[0]?.blknum
  const [setBusy, setBlockchainWallet, setUnconfirmedTx] = usePeriodicallyMerge(
    dispatchMergeUtxosStatus,
    dispatchMergeUtxos,
    lastBlknum
  )

  useEffect(() => {
    setBusy(loading.show || !blockchainWallet)
    setUnconfirmedTx(unconfirmedTxs?.[0])
  }, [
    blockchainWallet,
    loading.show,
    setBusy,
    setUnconfirmedTx,
    unconfirmedTxs
  ])

  useEffect(() => {
    setBlockchainWallet(blockchainWallet)
  }, [blockchainWallet, setBlockchainWallet])

  return null
}

const mapStateToProps = (state, ownProps) => ({
  blockchainWallet: state.setting.blockchainWallet,
  unconfirmedTxs: state.transaction.unconfirmedTxs,
  loading: state.loading
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchMergeUtxosStatus: (address, blknum) =>
    transactionActions.updateMergeUtxosBlknum(dispatch, address, blknum),
  dispatchMergeUtxos: (
    address,
    privateKey,
    listOfUtxos,
    lastBlknum,
    callback
  ) =>
    dispatch(
      plasmaActions.mergeUTXOs(
        address,
        privateKey,
        MAXIMUM_UTXOS_PER_CURRENCY,
        listOfUtxos,
        lastBlknum,
        callback
      )
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MergeUtxosTracker)
