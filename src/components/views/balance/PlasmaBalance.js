import React, { useState, Fragment } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { walletActions } from 'common/actions'
import { withTheme, Text } from 'react-native-paper'
import { useLoading } from 'common/hooks'
import Config from 'react-native-config'
import { formatter } from 'common/utils'
import { OMGItemToken, OMGAssetHeader, OMGAssetList } from 'components/widgets'

const PlasmaBalance = ({}) => {
  const currency = 'USD'

  return (
    <Fragment>
      <OMGAssetHeader
        amount={formatTotalBalance(0.0)}
        currency={currency}
        rootChain={true}
        blockchain={'Plasma'}
        network={Config.OMISEGO_NETWORK}
      />
      <OMGAssetList
        data={[]}
        keyExtractor={item => item.contractAddress}
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
)(withNavigation(withTheme(PlasmaBalance)))
