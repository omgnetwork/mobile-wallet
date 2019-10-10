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
  dispatchSetBlockchainWallet,
  provider
}) => {
  useEffect(() => {
    if (wallet && !blockchainWallet) {
      dispatchSetBlockchainWallet(wallet, provider)
    }
  }, [blockchainWallet, dispatchSetBlockchainWallet, provider, wallet])

  const renderChildren = useCallback(() => {
    if (shouldShowLoading(wallet, blockchainWallet)) {
      return (
        <View style={styles.container}>
          <OMGText style={styles.text(theme)} weight='bold'>
            Loading wallet...
          </OMGText>
          <OMGEmpty loading={true} style={styles.empty} />
        </View>
      )
    } else {
      return children
    }
  }, [blockchainWallet, children, theme, wallet])

  return <Fragment>{renderChildren()}</Fragment>
}

const shouldShowLoading = (wallet, blockchainWallet) => {
  return wallet && !blockchainWallet
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
  provider: state.setting.provider,
  blockchainWallet: state.setting.blockchainWallet
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetBlockchainWallet: (wallet, provider) =>
    dispatch(settingActions.setBlockchainWallet(wallet, provider))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(OMGInitializing))
