import React, { Fragment, useCallback } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { OMGActionSheetContainer } from 'components/widgets'
import { BlockchainNetworkType } from 'common/constants'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import WalletSwitcherItem from './WalletSwitcherItem'
import { withTheme } from 'react-native-paper'
import { settingActions, walletSwitcherActions } from 'common/actions'

const OMGActionSheetWalletSwitcher = ({
  theme,
  wallets,
  primaryWalletAddress,
  dispatchSetPrimaryWallet,
  primaryWalletNetwork,
  dispatchToggleWalletSwitcher,
  navigation,
  isVisible
}) => {
  const styles = createStyles(theme)

  const handleItemClick = useCallback(
    (wallet, network) => {
      dispatchToggleWalletSwitcher(false)
      dispatchSetPrimaryWallet(wallet, network)
      if (wallet.address !== primaryWalletAddress) {
        navigation.navigate('Initializer')
      } else {
        navigation.closeDrawer()
      }
    },
    [
      dispatchSetPrimaryWallet,
      dispatchToggleWalletSwitcher,
      navigation,
      primaryWalletAddress
    ]
  )

  const WalletSwitcherItems = wallets.map((wallet, index) => (
    <Fragment key={index}>
      <WalletSwitcherItem
        key={'eth' + index}
        wallet={wallet}
        onPress={handleItemClick}
        network={BlockchainNetworkType.TYPE_ETHEREUM_NETWORK}
        selected={
          primaryWalletAddress === wallet.address &&
          primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
        }
        style={styles.marginItem}
      />
      <WalletSwitcherItem
        key={'omg' + index}
        wallet={wallet}
        onPress={handleItemClick}
        network={BlockchainNetworkType.TYPE_OMISEGO_NETWORK}
        selected={
          primaryWalletAddress === wallet.address &&
          primaryWalletNetwork === BlockchainNetworkType.TYPE_OMISEGO_NETWORK
        }
        style={styles.marginItem}
      />
    </Fragment>
  ))
  return (
    <OMGActionSheetContainer isVisible={isVisible}>
      <View style={styles.container}>{WalletSwitcherItems}</View>
    </OMGActionSheetContainer>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      paddingTop: 28,
      paddingBottom: 16,
      paddingHorizontal: 24,
      width: Dimensions.get('window').width,
      flexDirection: 'column'
    },
    marginItem: {
      marginTop: 16
    }
  })

const mapStateToProps = (state, ownProps) => ({
  primaryWalletNetwork: state.setting.primaryWalletNetwork
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetPrimaryWallet: (wallet, network) =>
    settingActions.setPrimaryWallet(dispatch, wallet.address, network),
  dispatchToggleWalletSwitcher: visible =>
    walletSwitcherActions.toggle(dispatch, visible)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(OMGActionSheetWalletSwitcher)))
