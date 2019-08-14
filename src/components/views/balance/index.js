import React, { useEffect, useState } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet, View, Dimensions } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import { walletActions } from 'common/actions'
import { useLoading } from 'common/hooks'
import Config from 'react-native-config'
import { formatter } from 'common/utils'
import {
  OMGItemToken,
  OMGAssetFooter,
  OMGAssetHeader,
  OMGAssetList,
  OMGBackground,
  OMGEmpty,
  OMGViewPager
} from 'components/widgets'

// 48 = marginRight (8) + marginLeft (8) + paddingLeft (16) + paddingRight (16)
const pageWidth = Dimensions.get('window').width - 48

const Balance = ({
  theme,
  primaryWalletAddress,
  provider,
  getTxHistory,
  initAssets,
  wallets,
  loadingStatus
}) => {
  const rootChain = true
  const currency = 'USD'
  const blockchain = 'Ethereum'
  const primaryWallet = wallets.find(
    wallet => wallet.address === primaryWalletAddress
  )

  const [totalBalance, setTotalBalance] = useState(0.0)
  const [loading] = useLoading(loadingStatus)

  useEffect(() => {
    if (primaryWalletAddress && !primaryWallet.txHistory) {
      getTxHistory(primaryWalletAddress)
    }
  }, [primaryWalletAddress, getTxHistory, primaryWallet.txHistory])

  useEffect(() => {
    if (primaryWallet && primaryWallet.txHistory && !primaryWallet.assets) {
      initAssets(provider, primaryWalletAddress, primaryWallet.txHistory)
    }
  }, [initAssets, primaryWalletAddress, provider, primaryWallet])

  useEffect(() => {
    if (primaryWallet.assets) {
      const totalPrices = primaryWallet.assets.reduce((acc, asset) => {
        const parsedAmount = parseFloat(asset.balance)
        const tokenPrice = parsedAmount * asset.price
        return tokenPrice + acc
      }, 0)

      setTotalBalance(totalPrices)
    }
  }, [primaryWallet.assets])

  return (
    <OMGBackground style={styles.container(theme)}>
      <Text style={styles.title(theme)}>{primaryWallet.name}</Text>
      {!wallets ? (
        <OMGEmpty />
      ) : (
        <OMGViewPager pageWidth={pageWidth}>
          <View style={styles.firstPage}>
            <OMGAssetHeader
              amount={formatTotalBalance(totalBalance)}
              currency={currency}
              loading={loading}
              rootChain={rootChain}
              blockchain={blockchain}
              network={
                rootChain ? Config.ETHERSCAN_NETWORK : Config.OMISEGO_NETWORK
              }
            />
            <OMGAssetList
              data={(primaryWallet && primaryWallet.assets) || []}
              keyExtractor={item => item.contractAddress}
              loading={loading}
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
          </View>
          <View style={styles.secondPage}>
            <OMGAssetHeader
              amount={formatTotalBalance(totalBalance)}
              currency={currency}
              loading={loading}
              rootChain={rootChain}
              blockchain={blockchain}
              network={
                rootChain ? Config.ETHERSCAN_NETWORK : Config.OMISEGO_NETWORK
              }
            />
            <OMGAssetList
              data={(primaryWallet && primaryWallet.assets) || []}
              keyExtractor={item => item.contractAddress}
              loading={loading}
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
          </View>
          <View style={styles.thirdPage}>
            <OMGAssetHeader
              amount={formatTotalBalance(totalBalance)}
              currency={currency}
              loading={loading}
              rootChain={rootChain}
              blockchain={blockchain}
              network={
                rootChain ? Config.ETHERSCAN_NETWORK : Config.OMISEGO_NETWORK
              }
            />
            <OMGAssetList
              data={(primaryWallet && primaryWallet.assets) || []}
              keyExtractor={item => item.contractAddress}
              loading={loading}
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
          </View>
        </OMGViewPager>
      )}
      {rootChain ? null : <OMGAssetFooter />}
    </OMGBackground>
  )
}

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
    ellipsize: true
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

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.white
  }),
  firstPage: {
    width: pageWidth,
    marginRight: 8
  },
  secondPage: {
    width: pageWidth - 16
  },
  thirdPage: {
    width: pageWidth,
    marginLeft: 8
  },
  title: theme => ({
    fontSize: 18,
    marginBottom: 16,
    textTransform: 'uppercase',
    color: theme.colors.primary
  }),
  list: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 32
  }
})

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  wallets: state.wallets,
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createWallet: (provider, name) =>
    dispatch(walletActions.create(provider, name)),
  deleteAllWallet: () => dispatch(walletActions.clear()),
  getTxHistory: address =>
    dispatch(walletActions.getTransactionHistory(address)),
  initAssets: (provider, address, txHistory) =>
    dispatch(walletActions.initAssets(provider, address, txHistory))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Balance)))
