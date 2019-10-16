import React, { useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { settingActions } from 'common/actions'
import { OMGEmpty, OMGText } from 'components/widgets'

const Initializer = ({
  theme,
  children,
  blockchainWallet,
  wallet,
  dispatchSetPrimaryWallet,
  dispatchSetBlockchainWallet,
  provider,
  navigation,
  wallets
}) => {
  useEffect(() => {
    if (wallets.length === 0 || (wallet && provider && blockchainWallet)) {
      navigation.navigate('MainContent')
    } else if (shouldGetBlockchainWallet(wallet, blockchainWallet, provider)) {
      dispatchSetBlockchainWallet(wallet, provider)
    } else if (shouldSetPrimaryWallet(wallet, wallets)) {
      dispatchSetPrimaryWallet(wallets[0], wallets)
    }
  }, [
    blockchainWallet,
    dispatchSetBlockchainWallet,
    dispatchSetPrimaryWallet,
    navigation,
    provider,
    wallet,
    wallets
  ])

  const renderChildren = () => {
    if (wallets.length === 0) {
      return <Fragment>{children}</Fragment>
    } else if (wallet && blockchainWallet && provider) {
      return <Fragment>{children}</Fragment>
    } else {
      return (
        <View style={styles.container}>
          <OMGText style={styles.text(theme)} weight='bold'>
            Loading wallet...
          </OMGText>
          <OMGEmpty loading={true} style={styles.empty} />
        </View>
      )
    }
  }

  return renderChildren()
}

const shouldGetBlockchainWallet = (wallet, blockchainWallet, provider) => {
  return wallet && provider && !blockchainWallet && wallet.shouldRefresh
}

const shouldSetPrimaryWallet = (wallet, wallets) => {
  return !wallet && wallets.length > 0
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  text: theme => ({
    color: theme.colors.primary
  }),
  empty: {
    flex: 0
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider,
  blockchainWallet: state.setting.blockchainWallet
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetBlockchainWallet: (wallet, provider) =>
    dispatch(settingActions.setBlockchainWallet(wallet, provider)),
  dispatchSetPrimaryWallet: wallet =>
    settingActions.setPrimaryAddress(dispatch, wallet.address)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Initializer)))
