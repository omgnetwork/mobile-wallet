import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useMergeInterval } from 'common/hooks'
import { BlockchainNetworkType } from 'common/constants'
import { plasmaActions, transactionActions } from 'common/actions'

const MAXIMUM_UTXOS_PER_CURRENCY = 1

const MergeUtxosTracker = ({
  blockchainWallet,
  unconfirmedTxs,
  loading,
  dispatchUpdateMergeUtxosStatus,
  dispatchMergeUtxos,
  primaryWalletNetwork
}) => {
  if (primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK)
    return null

  const [setLoading, setBlockchainWallet, setUnconfirmedTx] = useMergeInterval(
    dispatchUpdateMergeUtxosStatus,
    dispatchMergeUtxos,
    MAXIMUM_UTXOS_PER_CURRENCY
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

const mapStateToProps = (state, _ownProps) => ({
  blockchainWallet: state.setting.blockchainWallet,
  unconfirmedTxs: state.transaction.unconfirmedTxs,
  loading: state.loading,
  primaryWalletNetwork: state.setting.primaryWalletNetwork
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchUpdateMergeUtxosStatus: (address, blknum) =>
    transactionActions.updateMergeUtxosBlknum(dispatch, address, blknum),
  dispatchMergeUtxos: (
    address,
    privateKey,
    maximumUtxosPerCurrenncy,
    listOfUtxos,
    updateBlknumCallback
  ) =>
    dispatch(
      plasmaActions.mergeUTXOs(
        address,
        privateKey,
        maximumUtxosPerCurrenncy,
        listOfUtxos,
        updateBlknumCallback
      )
    )
})

export default connect(mapStateToProps, mapDispatchToProps)(MergeUtxosTracker)
