import React, { useState, Fragment, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { childchainActions, walletActions } from 'common/actions'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { Formatter, Datetime } from 'common/utils'
import {
  OMGItemToken,
  OMGAssetHeader,
  OMGAssetList,
  OMGAssetFooter
} from 'components/widgets'

const ChildchainBalance = ({
  dispatchLoadAssets,
  dispatchSetShouldRefreshChildchain,
  wallet,
  navigation
}) => {
  const currency = 'USD'
  const [totalBalance, setTotalBalance] = useState(0.0)

  useEffect(() => {
    if (wallet.shouldRefreshChildchain) {
      dispatchLoadAssets(wallet)
      dispatchSetShouldRefreshChildchain(wallet.address, false)
    }
  }, [dispatchLoadAssets, dispatchSetShouldRefreshChildchain, wallet])

  useEffect(() => {
    if (wallet.childchainAssets) {
      const totalPrices = wallet.childchainAssets.reduce((acc, asset) => {
        const parsedAmount = parseFloat(asset.balance)
        const tokenPrice = parsedAmount * asset.price
        return tokenPrice + acc
      }, 0)

      setTotalBalance(totalPrices)
    }
  }, [wallet.childchainAssets])

  return (
    <Fragment>
      <OMGAssetHeader
        amount={formatTotalBalance(totalBalance)}
        currency={currency}
        rootchain={false}
        blockchain={'Childchain'}
        network={Config.OMISEGO_NETWORK}
      />
      <OMGAssetList
        data={wallet.childchainAssets || []}
        keyExtractor={item => item.contractAddress}
        updatedAt={Datetime.format(wallet.updatedAt, 'LTS')}
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
      <OMGAssetFooter
        onPressDeposit={() => navigation.navigate('TransferDeposit')}
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
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchLoadAssets: wallet =>
    dispatch(
      childchainActions.fetchAssets(wallet.rootchainAssets, wallet.address)
    ),
  dispatchSetShouldRefreshChildchain: (address, shouldRefreshChildchain) =>
    walletActions.setShouldRefreshChildchain(
      dispatch,
      address,
      shouldRefreshChildchain
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ChildchainBalance)))
