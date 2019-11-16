import React, { useEffect, useState, Fragment, useCallback } from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { walletActions, ethereumActions } from 'common/actions'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { Formatter, Datetime } from 'common/utils'
import { OMGItemToken, OMGAssetHeader, OMGAssetList } from 'components/widgets'

const RootchainBalance = ({
  pendingTxs,
  provider,
  dispatchLoadAssets,
  wallet,
  dispatchRefreshRootchain,
  anchoredComponentRef
}) => {
  const [totalBalance, setTotalBalance] = useState(0.0)
  const [loading, setLoading] = useState(false)
  const currency = 'USD'

  useEffect(() => {
    if (provider && wallet.shouldRefresh) {
      dispatchLoadAssets(provider, wallet.address, wallet.updatedBlock || '0')
      dispatchRefreshRootchain(wallet.address, false)
      setLoading(true)
    }
  }, [
    dispatchLoadAssets,
    pendingTxs,
    provider,
    dispatchRefreshRootchain,
    wallet
  ])

  useEffect(() => {
    if (wallet.rootchainAssets) {
      setLoading(false)
      const totalPrices = wallet.rootchainAssets.reduce((acc, asset) => {
        const parsedAmount = parseFloat(asset.balance)
        const tokenPrice = parsedAmount * asset.price
        return tokenPrice + acc
      }, 0)

      setTotalBalance(totalPrices)
    }
  }, [wallet.rootchainAssets])

  const handleReload = useCallback(() => {
    dispatchRefreshRootchain(wallet.address, true)
  }, [dispatchRefreshRootchain, wallet.address])

  return (
    <Fragment>
      <OMGAssetHeader
        amount={formatTotalBalance(totalBalance)}
        currency={currency}
        loading={loading}
        rootchain={true}
        blockchain={'Ethereum'}
        anchoredRef={anchoredComponentRef}
        network={Config.ETHERSCAN_NETWORK}
      />
      <OMGAssetList
        data={wallet.rootchainAssets || []}
        keyExtractor={item => item.contractAddress}
        updatedAt={Datetime.format(wallet.updatedAt, 'LTS')}
        loading={loading}
        handleReload={handleReload}
        style={styles.list}
        renderItem={({ item }) => (
          <OMGItemToken key={item.contractAddress} token={item} />
        )}
      />
    </Fragment>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  }
})

const formatTotalBalance = balance => {
  return Formatter.format(balance, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const mapStateToProps = (state, ownProps) => ({
  pendingTxs: state.transaction.pendingTxs,
  provider: state.setting.provider,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchLoadAssets: (provider, address, lastBlockNumber) =>
    dispatch(ethereumActions.fetchAssets(provider, address, lastBlockNumber)),
  dispatchRefreshRootchain: (address, shouldRefresh) =>
    walletActions.refreshRootchain(dispatch, address, shouldRefresh)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(RootchainBalance))
