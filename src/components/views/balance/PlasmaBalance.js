import React, { useState, Fragment } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { walletActions } from 'common/actions'
import { withTheme, Text } from 'react-native-paper'
import Config from 'react-native-config'
import { Formatter } from 'common/utils'
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
    ellipsize: true
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
  wallets: state.wallets,
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createWallet: (provider, name) =>
    dispatch(walletActions.create(provider, name)),
  deleteAllWallet: () => dispatch(walletActions.clear())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(PlasmaBalance)))
