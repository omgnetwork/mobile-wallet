import React from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { colors } from 'common/styles'
import { OMGText, OMGIcon } from 'components/widgets'
import { settingActions } from 'common/actions'

const OMGDrawerWalletItem = ({ wallet, primary, onWalletPress }) => {
  return (
    <TouchableOpacity
      style={walletItemStyles.container}
      onPress={() => onWalletPress(wallet)}>
      <Image
        style={walletItemStyles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${wallet.address}.png`
        }}
      />
      <OMGText style={walletItemStyles.name}>{wallet.name}</OMGText>
      {primary && (
        <OMGIcon
          name='check-mark'
          size={14}
          style={walletItemStyles.iconRight}
        />
      )}
    </TouchableOpacity>
  )
}

const walletItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center'
  },
  logo: {
    width: 24,
    height: 24
  },
  name: {
    flex: 1,
    marginLeft: 16,
    color: colors.gray3
  },
  iconRight: {
    marginRight: 30
  }
})

const OMGDrawerContent = ({
  navigation,
  dispatchSetPrimaryWalletAddress,
  primaryWallet,
  wallets
}) => {
  const handleWalletPress = wallet => {
    dispatchSetPrimaryWalletAddress(wallet.address)
    navigation.closeDrawer()
  }

  const handleManageWalletPress = () => {
    navigation.navigate('ManageWallet')
    requestAnimationFrame(() => {
      navigation.closeDrawer()
    })
  }

  return (
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}>
      {wallets.length > 0 && (
        <View>
          <OMGText weight='bold' style={styles.titleText}>
            WALLETS
          </OMGText>

          {wallets.map(wallet => (
            <OMGDrawerWalletItem
              wallet={wallet}
              key={wallet.address}
              onWalletPress={handleWalletPress}
              primary={
                primaryWallet && primaryWallet.address === wallet.address
              }
            />
          ))}
        </View>
      )}

      <View style={styles.settingContainer}>
        <OMGText weight='bold' style={styles.titleText}>
          SETTINGS
        </OMGText>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleManageWalletPress}>
          <OMGText style={styles.settingItemText}>Manage Wallets</OMGText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingTop: 64
  },
  walletContainer: {
    marginTop: 16,
    flexDirection: 'column'
  },
  settingContainer: {
    marginTop: 16,
    flexDirection: 'column'
  },
  titleText: {
    color: colors.gray3
  },
  settingItemText: {
    color: colors.black3
  },
  settingItem: {
    paddingVertical: 12
  }
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  wallets: state.wallets
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetPrimaryWalletAddress: primaryAddress =>
    settingActions.setPrimaryAddress(dispatch, primaryAddress)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(OMGDrawerContent)))
