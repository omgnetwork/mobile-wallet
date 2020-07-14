import React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { OMGActionSheetWalletSwitcher } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const MainContainer = ({
  navigation,
  walletSwitcherVisible,
  wallets,
  primaryWallet
}) => {
  const MainDrawerNavigator = navigation.getParam('navigator')

  return (
    <View style={styles.container}>
      <MainDrawerNavigator navigation={navigation} />
      <OMGActionSheetWalletSwitcher
        isVisible={walletSwitcherVisible}
        wallets={wallets}
        primaryWalletAddress={primaryWallet?.address}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const mapStateToProps = (state, _ownProps) => ({
  walletSwitcherVisible: state.walletSwitcher.visible,
  wallets: state.wallets,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(mapStateToProps, null)(withTheme(MainContainer))
