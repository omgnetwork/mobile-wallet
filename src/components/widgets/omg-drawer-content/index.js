import React, { Fragment, useCallback } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { SafeAreaView, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { OMGText, OMGFontIcon } from 'components/widgets'
import OMGDrawerWallet from './OMGDrawerWallet'
import { settingActions, onboardingActions } from 'common/actions'
import { ScrollView } from 'react-native-gesture-handler'
import Intercom from 'react-native-intercom'
import { Styles } from 'common/utils'

const ManageWalletMenu = ({
  theme,
  title,
  style,
  onPress,
  showCaret = true
}) => {
  return (
    <TouchableOpacity
      style={{ ...menuStyles.container, ...style }}
      onPress={onPress}>
      <OMGText style={menuStyles.titleLeft(theme)}>{title}</OMGText>
      {showCaret && (
        <OMGFontIcon
          name='chevron-right'
          size={14}
          style={menuStyles.iconRight}
        />
      )}
    </TouchableOpacity>
  )
}

const OMGDrawerContent = ({
  navigation,
  dispatchSetPrimaryWalletAddress,
  dispatchSetCurrentPage,
  dispatchTakeAppTour,
  primaryWallet,
  theme,
  wallets
}) => {
  const handleWalletPress = wallet => {
    dispatchSetPrimaryWalletAddress(wallet.address)
    navigation.navigate('Initializer')
  }

  const closeDrawerAndNavigate = destination => {
    dispatchSetCurrentPage(destination)
    navigation.navigate(destination)
    requestAnimationFrame(() => {
      navigation.closeDrawer()
    })
  }

  const takeAppTour = () => {
    navigation.closeDrawer()
    dispatchTakeAppTour()
    requestAnimationFrame(() => {
      navigation.navigate('Balance', { page: 1 })
    })
  }

  const openIntercom = () => {
    Intercom.registerUnidentifiedUser()
    Intercom.displayMessenger()
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
                <OMGDrawerWallet
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
            onPress={() => closeDrawerAndNavigate('ImportWallet')}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Create Wallet'
            theme={theme}
            onPress={() => closeDrawerAndNavigate('CreateWallet')}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Delete Wallet'
            theme={theme}
            onPress={() => closeDrawerAndNavigate('DeleteWallet')}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Take App Tour'
            theme={theme}
            showCaret={false}
            onPress={takeAppTour}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Support/Feedback'
            theme={theme}
            showCaret={false}
            onPress={openIntercom}
          />
          <View style={styles.divider(theme)} />
          <View style={styles.expander} />
          <View style={styles.environment}>
            <OMGText style={styles.environmentTitleText(theme)}>
              Environment Info
            </OMGText>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)}>
                Ethereum
              </OMGText>
              <OMGText style={styles.environmentItemTextLighter(theme)}>
                {Config.ETHEREUM_NETWORK}
              </OMGText>
            </View>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)}>
                OMG Network Contract
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
                {Config.WATCHER_URL}
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
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    }),
    color: theme.colors.gray7
  }),
  iconRight: {}
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingTop: Styles.getResponsiveSize(32, { small: 16, medium: 24 })
  },
  divider: theme => ({
    backgroundColor: theme.colors.white2,
    height: 1,
    opacity: 0.3
  }),
  scrollView: {
    flexGrow: 1
  },
  settingContainer: {
    flex: 1,
    marginTop: Styles.getResponsiveSize(16, { small: 0, medium: 8 }),
    paddingRight: 16,
    flexDirection: 'column'
  },
  titleText: theme => ({
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    textTransform: 'uppercase',
    color: theme.colors.black5,
    marginTop: 12
  }),
  envInfoCard: theme => ({
    marginTop: 16,
    padding: 16,
    backgroundColor: theme.colors.white2
  }),
  expander: {
    flex: 1
  },
  environment: {
    marginBottom: Styles.getResponsiveSize(24, { small: 16, medium: 20 }),
    marginTop: Styles.getResponsiveSize(32, { small: 16, medium: 24 })
  },
  environmentTitleText: theme => ({
    color: theme.colors.gray4,
    fontSize: 12,
    letterSpacing: -0.48,
    paddingBottom: 8
  }),
  environmentItemText: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    }),
    color: theme.colors.gray5
  }),
  environmentItemTextLighter: theme => ({
    color: theme.colors.gray4,
    fontSize: 12,
    marginTop: 4,
    letterSpacing: -0.48
  })
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  wallets: state.wallets,
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetPrimaryWalletAddress: primaryAddress =>
    settingActions.setPrimaryAddress(dispatch, primaryAddress),
  dispatchSetCurrentPage: (currentPage, page) =>
    onboardingActions.setCurrentPage(dispatch, currentPage, page),
  dispatchTakeAppTour: () =>
    onboardingActions.setEnableOnboarding(dispatch, true)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(OMGDrawerContent)))
