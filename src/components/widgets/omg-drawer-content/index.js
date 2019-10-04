import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { SafeAreaView, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { colors } from 'common/styles'
import { OMGText } from 'components/widgets'
import OMGDrawerContentItem from './OMGDrawerContentItem'
import { settingActions } from 'common/actions'

const OMGDrawerContent = ({
  navigation,
  dispatchSetPrimaryWalletAddress,
  primaryWallet,
  theme,
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
            <OMGDrawerContentItem
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
        <View style={styles.expander} />
        <View style={styles.environment}>
          <OMGText weight='bold' style={styles.environmentTitleText(theme)}>
            ENVIRONMENT INFO
          </OMGText>
          <OMGText style={styles.environmentItemText(theme)}>
            Ethereum Network:{' '}
            <OMGText weight='bold'>{Config.ETHERSCAN_NETWORK}</OMGText>
          </OMGText>
          <OMGText style={styles.environmentItemText(theme)}>
            Watcher URL:{' '}
            <OMGText weight='bold'>{Config.CHILDCHAIN_WATCHER_URL}</OMGText>
          </OMGText>
          <OMGText style={styles.environmentItemText(theme)}>
            Plasma Contract:{' '}
            <OMGText weight='bold'>{Config.PLASMA_CONTRACT_ADDRESS}</OMGText>
          </OMGText>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingTop: 32
  },
  walletContainer: {
    marginTop: 16,
    flexDirection: 'column'
  },
  settingContainer: {
    flex: 1,
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
  },
  expander: {
    flex: 1
  },
  environment: {
    marginBottom: 24,
    marginTop: 16
  },
  environmentTitleText: theme => ({
    opacity: 0.5,
    color: theme.colors.gray3
  }),
  environmentItemText: theme => ({
    marginTop: 8,
    opacity: 0.5
  })
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
