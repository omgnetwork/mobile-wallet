import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useMergeInterval } from 'common/hooks'
import { plasmaActions, transactionActions } from 'common/actions'

const MAXIMUM_UTXOS_PER_CURRENCY = 4

const MergeUtxosTracker = ({
  blockchainWallet,
  unconfirmedTxs,
  loading,
  dispatchUpdateMergeUtxosStatus,
  dispatchMergeUtxos
}) => {
  const [setLoading, setBlockchainWallet, setUnconfirmedTx] = useMergeInterval(
    dispatchUpdateMergeUtxosStatus,
    dispatchMergeUtxos
  )

  useEffect(() => {
    setLoading(loading)
  }, [loading, setLoading])

  useEffect(() => {
    setUnconfirmedTx(unconfirmedTxs?.[0])
  }, [setUnconfirmedTx, unconfirmedTxs])

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
  dispatchUpdateMergeUtxosStatus: (address, blknum) =>
    transactionActions.updateMergeUtxosBlknum(dispatch, address, blknum),
  dispatchMergeUtxos: (address, privateKey, listOfUtxos, blknum, storeBlknum) =>
    dispatch(
      plasmaActions.mergeUTXOs(
        address,
        privateKey,
        MAXIMUM_UTXOS_PER_CURRENCY,
        listOfUtxos,
        blknum,
        storeBlknum
      )
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MergeUtxosTracker)
