import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { walletActions } from 'common/actions'
import EthereumBalance from './EthereumBalance'
import PlasmaBalance from './PlasmaBalance'
import LinearGradient from 'react-native-linear-gradient'
import ShowQR from './ShowQR'
import {
  OMGEmpty,
  OMGViewPager,
  OMGText,
  OMGStatusBar
} from 'components/widgets'

const pageWidth = Dimensions.get('window').width - 56

const Balance = ({ theme, primaryWallet, navigation, loading, wallets }) => {
  useEffect(() => {
    function willFocus() {
      StatusBar.setBarStyle('light-content')
    }

    const willFocusSubscription = navigation.addListener('willFocus', willFocus)

    return () => {
      willFocusSubscription.remove()
    }
  }, [navigation, primaryWallet])

  return (
    <SafeAreaView style={styles.safeAreaView(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.blacks}
      />
      <LinearGradient
        style={styles.container}
        colors={[theme.colors.black5, theme.colors.gray1]}>
        <OMGText style={styles.title(theme)}>
          {primaryWallet ? primaryWallet.name : 'Initializing...'}
        </OMGText>
        {!wallets || !primaryWallet ? (
          <OMGEmpty loading={loading.show} />
        ) : (
          <OMGViewPager pageWidth={pageWidth}>
            <View style={styles.firstPage}>
              <PlasmaBalance primaryWallet={primaryWallet} />
            </View>
            <View style={styles.secondPage}>
              <EthereumBalance primaryWallet={primaryWallet} />
            </View>
            <View style={styles.thirdPage}>
              <ShowQR primaryWallet={primaryWallet} />
            </View>
          </OMGViewPager>
        )}
        {/* {rootChain ? null : <OMGAssetFooter />} */}
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  container: {
    flex: 1,
    padding: 16
  },
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
    color: theme.colors.white
  }),
  list: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 32
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
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
)(withTheme(Balance))
