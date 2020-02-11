import React, { Fragment } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { SafeAreaView, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { OMGText, OMGFontIcon } from 'components/widgets'
import OMGDrawerContentItem from './OMGDrawerContentItem'
import { settingActions, onboardingActions } from 'common/actions'
import { ScrollView } from 'react-native-gesture-handler'

const ManageWalletMenu = ({ theme, title, style, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...menuStyles.container, ...style }}
      onPress={onPress}>
      <OMGText style={menuStyles.titleLeft(theme)}>{title}</OMGText>
      <OMGFontIcon
        name='chevron-right'
        size={14}
        style={menuStyles.iconRight}
      />
    </TouchableOpacity>
  )
}

const OMGDrawerContent = ({
  navigation,
  dispatchSetPrimaryWalletAddress,
  dispatchSetCurrentPage,
  primaryWallet,
  theme,
  wallets
}) => {
  const handleWalletPress = wallet => {
    dispatchSetPrimaryWalletAddress(wallet.address)
    navigation.navigate('Initializer')
  }

  const handleManageWalletMenuPress = destination => {
    dispatchSetCurrentPage(destination)
    navigation.navigate(destination)
    requestAnimationFrame(() => {
      navigation.closeDrawer()
    })
  }

  return (
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {wallets.length > 0 && (
          <View key='wallet-container'>
            <OMGText weight='regular' style={styles.titleText(theme)}>
              WALLETS
            </OMGText>

            {wallets.map((wallet, index) => (
              <Fragment key={index}>
                <OMGDrawerContentItem
                  wallet={wallet}
                  onWalletPress={handleWalletPress}
                  primary={
                    primaryWallet && primaryWallet.address === wallet.address
                  }
                />
                <View style={styles.divider(theme)} />
              </Fragment>
            ))}
          </View>
        )}

        <View style={styles.settingContainer} key={'setting-container'}>
          <OMGText weight='regular' style={styles.titleText(theme)}>
            Manage
          </OMGText>
          <ManageWalletMenu
            title='Import Wallet'
            theme={theme}
            onPress={() => handleManageWalletMenuPress('ImportWallet')}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Create Wallet'
            theme={theme}
            onPress={() => handleManageWalletMenuPress('CreateWallet')}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Backup Wallet'
            theme={theme}
            onPress={() => handleManageWalletMenuPress('BackupWallet')}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Delete Wallet'
            theme={theme}
            onPress={() => handleManageWalletMenuPress('DeleteWallet')}
          />
          <View style={styles.divider(theme)} />
          <View style={styles.expander} />
          <View style={styles.environment}>
            <OMGText style={styles.environmentTitleText(theme)}>
              Environment Info
            </OMGText>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)}>
                Ethereum Network
              </OMGText>
              <OMGText style={styles.environmentItemTextLighter(theme)}>
                {Config.ETHERSCAN_NETWORK}
              </OMGText>
            </View>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)}>
                Plasma Contract
              </OMGText>
              <OMGText style={styles.environmentItemTextLighter(theme)}>
                {Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS}
              </OMGText>
            </View>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)}>
                Watcher URL
              </OMGText>
              <OMGText style={styles.environmentItemTextLighter(theme)}>
                {Config.CHILDCHAIN_WATCHER_URL}
              </OMGText>
            </View>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)}>
                Version
              </OMGText>
              <OMGText style={styles.environmentItemTextLighter(theme)}>
                {Config.VERSION}
              </OMGText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const menuStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16
  },
  titleLeft: theme => ({
    flex: 1,
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.new_gray8
  }),
  iconRight: {}
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingTop: 32
  },
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.3
  }),
  scrollView: {
    flexGrow: 1
  },
  walletContainer: {
    marginTop: 16,
    flexDirection: 'column'
  },
  settingContainer: {
    flex: 1,
    marginTop: 16,
    paddingRight: 16,
    flexDirection: 'column'
  },
  titleText: theme => ({
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.gray4,
    marginTop: 12
  }),
  envInfoCard: theme => ({
    marginTop: 16,
    padding: 16,
    backgroundColor: theme.colors.new_white2
  }),
  settingItem: {
    paddingVertical: 12
  },
  expander: {
    flex: 1
  },
  environment: {
    marginBottom: 24,
    marginTop: 32
  },
  environmentTitleText: theme => ({
    color: theme.colors.new_gray5,
    fontSize: 12,
    letterSpacing: -0.48,
    paddingBottom: 8
  }),
  environmentItemText: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.new_gray6
  }),
  environmentItemTextLighter: theme => ({
    color: theme.colors.new_gray5,
    fontSize: 12,
    marginTop: 4,
    letterSpacing: -0.48
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
    settingActions.setPrimaryAddress(dispatch, primaryAddress),
  dispatchSetCurrentPage: (currentPage, page) => {
    onboardingActions.setCurrentPage(dispatch, currentPage, page)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(OMGDrawerContent)))
