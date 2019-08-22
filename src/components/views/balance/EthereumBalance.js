import React, { useEffect, useState, Fragment } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, RefreshControl } from 'react-native'
import { walletActions } from 'common/actions'
import { withTheme, Text } from 'react-native-paper'
import Config from 'react-native-config'
import { Formatter } from 'common/utils'
import { OMGItemToken, OMGAssetHeader, OMGAssetList } from 'components/widgets'

const EthereumBalance = ({
  theme,
  primaryWallet,
  primaryWalletAddress,
  provider,
  loadAssets,
  loading
}) => {
  const [totalBalance, setTotalBalance] = useState(0.0)
  const currency = 'USD'

  useEffect(() => {
    if ((provider && !primaryWallet.assets) || primaryWallet.shouldRefresh) {
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
        loading={loading.show}
        rootChain={true}
        blockchain={'Ethereum'}
        network={Config.ETHERSCAN_NETWORK}
      />
      <OMGAssetList
        data={primaryWallet.assets || []}
        keyExtractor={item => item.contractAddress}
        loading={loading.show}
        refreshControl={
          <RefreshControl
            refreshing={loading.show}
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
  return Formatter.format(balance, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const formatTokenBalance = amount => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: 3,
    ellipsize: false
  })
}

const formatTokenPrice = (amount, price) => {
  const parsedAmount = parseFloat(amount)
  const tokenPrice = parsedAmount * price
  return Formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
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
