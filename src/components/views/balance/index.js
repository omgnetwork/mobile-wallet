import React, { useEffect, useState } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet, View, Dimensions } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import { walletActions } from 'common/actions'
import EthereumBalance from './EthereumBalance'
import PlasmaBalance from './PlasmaBalance'
import ShowQR from './ShowQR'
import { OMGBackground, OMGEmpty, OMGViewPager } from 'components/widgets'

// 48 = marginRight (8) + marginLeft (8) + paddingLeft (16) + paddingRight (16)
const pageWidth = Dimensions.get('window').width - 56

const Balance = ({ theme, primaryWalletAddress, wallets }) => {
  const rootChain = true
  const primaryWallet = wallets.find(
    wallet => wallet.address === primaryWalletAddress
  )

  return (
    <OMGBackground style={styles.container(theme)}>
      <Text style={styles.title(theme)}>{primaryWallet.name}</Text>
      {!wallets ? (
        <OMGEmpty />
      ) : (
        <OMGViewPager pageWidth={pageWidth}>
          <View style={styles.firstPage}>
            <PlasmaBalance />
          </View>
          <View style={styles.secondPage}>
            <EthereumBalance />
          </View>
          <View style={styles.thirdPage}>
            <ShowQR />
          </View>
        </OMGViewPager>
      )}
      {/* {rootChain ? null : <OMGAssetFooter />} */}
    </OMGBackground>
  )
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
