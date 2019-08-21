import React, { useEffect, useState, Fragment } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, RefreshControl } from 'react-native'
import { walletActions } from 'common/actions'
import { withTheme, Text } from 'react-native-paper'
import { useLoading } from 'common/hooks'
import Config from 'react-native-config'
import { formatter } from 'common/utils'
import { OMGItemToken, OMGAssetHeader, OMGAssetList } from 'components/widgets'

const EthereumBalance = ({
  theme,
  primaryWallet,
  primaryWalletAddress,
  provider,
  loadAssets,
  loadingStatus
}) => {
  const [totalBalance, setTotalBalance] = useState(0.0)
  const [loading] = useLoading(loadingStatus)
  const currency = 'USD'

  useEffect(() => {
    if (provider && !primaryWallet.assets) {
      loadAssets(provider, primaryWalletAddress)
    }
  }, [loadAssets, primaryWalletAddress, provider, primaryWallet])

  useEffect(() => {
    if (primaryWallet.assets) {
      const totalPrices = primaryWallet.assets.reduce((acc, asset) => {
        const parsedAmount = parseFloat(asset.balance)
        const tokenPrice = parsedAmount * asset.price
        return tokenPrice + acc
      }, 0)

      setTotalBalance(totalPrices)
    }
  }, [primaryWallet])

  return (
    <Fragment>
      <OMGAssetHeader
        amount={formatTotalBalance(totalBalance)}
        currency={currency}
        loading={loading}
        rootChain={true}
        blockchain={'Ethereum'}
        network={Config.ETHERSCAN_NETWORK}
      />
      <OMGAssetList
        data={primaryWallet.assets || []}
        keyExtractor={item => item.contractAddress}
        loading={loading}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => loadAssets(provider, primaryWalletAddress)}
          />
        }
        style={styles.list}
        renderItem={({ item }) => (
          <OMGItemToken
            key={item.contractAddress}
            symbol={item.tokenSymbol}
            balance={formatTokenBalance(item.balance)}
            price={formatTokenPrice(item.balance, item.price)}
          />
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
  return formatter.format(balance, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const formatTokenBalance = amount => {
  return formatter.format(amount, {
    commify: true,
    maxDecimal: 3,
    ellipsize: false
  })
}

const formatTokenPrice = (amount, price) => {
  const parsedAmount = parseFloat(amount)
  const tokenPrice = parsedAmount * price
  return formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createWallet: (provider, name) =>
    dispatch(walletActions.create(provider, name)),
  deleteAllWallet: () => dispatch(walletActions.clear()),
  loadAssets: (provider, address) =>
    dispatch(walletActions.loadAssets(provider, address))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(EthereumBalance))
