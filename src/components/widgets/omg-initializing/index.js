import React, { useCallback, useEffect, Fragment } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View } from 'react-native'
import { withTheme } from 'react-native-paper'
import { settingActions } from 'common/actions'
import { OMGEmpty, OMGText } from 'components/widgets'

const OMGInitializing = ({
  children,
  theme,
  blockchainWallet,
  wallet,
  loading,
  dispatchSetPrimaryWallet,
  dispatchSetBlockchainWallet,
  provider,
  wallets
}) => {
  // useEffect(() => {
  //   if (shouldGetBlockchainWallet(wallet, blockchainWallet)) {
  //     dispatchSetBlockchainWallet(wallet, provider)
  //   }
  // }, [blockchainWallet, dispatchSetBlockchainWallet, provider, wallet])
  const shouldGetBlockchainWallet = () => {
    return wallet && !blockchainWallet && wallet.shouldRefresh
  }

  const shouldSetPrimaryWallet = () => {
    return !wallet && wallets.length > 0
  }

  const renderChildren = () => {
    console.log(loading)
    // if (shouldGetBlockchainWallet(wallet, blockchainWallet)) {
    //   return (
    //     <View style={styles.container}>
    //       <OMGText style={styles.text(theme)} weight='bold'>
    //         Loading wallet...
    //       </OMGText>
    //       <OMGEmpty loading={true} style={styles.empty} />
    //     </View>
    //   )
    // } else {
    return children
    // }
  }

  return <Fragment>{renderChildren()}</Fragment>
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
)(withTheme(OMGInitializing))
