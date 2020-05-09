import React, { useCallback } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { SafeAreaView, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { OMGText, OMGFontIcon, OMGIdenticon } from 'components/widgets'
import { settingActions, onboardingActions } from 'common/actions'
import { ScrollView } from 'react-native-gesture-handler'
import Intercom from 'react-native-intercom'
import { hexToRgb } from 'common/styles/colors'
import { Styles, Alerter } from 'common/utils'
import { Alert } from 'common/constants'

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
      <OMGText style={menuStyles.titleLeft(theme)} weight='book'>
        {title}
      </OMGText>
      {showCaret && (
        <OMGFontIcon
          name='chevron-right'
          size={8}
          style={menuStyles.iconRight(theme)}
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
  const handleCopyClick = useCallback(() => {
    Clipboard.setString(primaryWallet.address)
    Alerter.show(Alert.SUCCESS_COPIED_ADDRESS)
  }, [primaryWallet.address])

  const closeDrawerAndNavigate = destination => {
    dispatchSetCurrentPage(destination)
    navigation.navigate(destination)
    requestAnimationFrame(() => {
      navigation.closeDrawer()
    })
  }

  const openIntercom = () => {
    Intercom.registerUnidentifiedUser()
    Intercom.displayMessenger()
  }

  return (
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: 'never', horizontal: 'never' }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer(theme)}>
          <OMGIdenticon
            style={styles.logo}
            hash={primaryWallet.address}
            size={36}
          />
          <OMGText style={styles.textWalletName(theme)} weight='book'>
            {primaryWallet.name}
          </OMGText>
          <View style={styles.row}>
            <OMGText
              style={styles.hashText(theme)}
              ellipsizeMode='middle'
              numberOfLines={1}>
              {primaryWallet.address}
            </OMGText>
            <TouchableOpacity onPress={handleCopyClick}>
              <OMGFontIcon
                name='copy'
                size={Styles.getResponsiveSize(24, { small: 20, medium: 20 })}
                color={theme.colors.gray2}
              />
            </TouchableOpacity>
          </View>
          <ManageWalletMenu
            title='Transactions'
            theme={theme}
            onPress={() => closeDrawerAndNavigate('ImportWallet')}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Deposits'
            theme={theme}
            onPress={() => closeDrawerAndNavigate('ImportWallet')}
          />
          <View style={styles.divider(theme)} />
          <ManageWalletMenu
            title='Withdraws'
            theme={theme}
            onPress={() => closeDrawerAndNavigate('ImportWallet')}
          />
        </View>

        <View style={styles.settingContainer} key={'setting-container'}>
          <OMGText weight='book' style={styles.titleText(theme)}>
            App
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
            title='Support/Feedback'
            theme={theme}
            showCaret={false}
            onPress={openIntercom}
          />
          <View style={styles.divider(theme)} />
          <View style={styles.expander} />
          <View style={styles.environment}>
            <OMGText style={styles.titleText(theme)} weight='book'>
              Environment Info
            </OMGText>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)} weight='book'>
                Ethereum Network
              </OMGText>
              <OMGText style={styles.environmentItemTextLighter(theme)}>
                {Config.ETHEREUM_NETWORK}
              </OMGText>
            </View>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)} weight='book'>
                Plasma Contract
              </OMGText>
              <OMGText style={styles.environmentItemTextLighter(theme)}>
                {Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS}
              </OMGText>
            </View>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)} weight='book'>
                Watcher URL
              </OMGText>
              <OMGText style={styles.environmentItemTextLighter(theme)}>
                {Config.WATCHER_URL}
              </OMGText>
            </View>
            <View style={styles.envInfoCard(theme)}>
              <OMGText style={styles.environmentItemText(theme)} weight='book'>
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
    paddingVertical: 16,
    alignItems: 'center'
  },
  titleLeft: theme => ({
    flex: 1,
    fontSize: Styles.getResponsiveSize(16, { small: 14, medium: 16 }),
    color: theme.colors.black5
  }),
  iconRight: theme => ({ color: theme.colors.gray3 })
})

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divider: theme => ({
    backgroundColor: theme.colors.gray2,
    height: 1,
    opacity: 0.15
  }),
  scrollView: {
    flexGrow: 1
  },
  textWalletName: theme => ({
    color: theme.colors.black5,
    fontSize: 32,
    marginTop: 20
  }),
  hashText: theme => ({
    width: 128,
    marginRight: 8,
    fontSize: 12,
    color: theme.colors.black5
  }),
  headerContainer: theme => ({
    paddingTop: Styles.getResponsiveSize(70, { small: 36, medium: 56 }),
    backgroundColor: hexToRgb(theme.colors.blue2, 0.2),
    flexDirection: 'column',
    paddingLeft: 34,
    paddingRight: 40,
    paddingBottom: 30
  }),
  settingContainer: {
    flex: 1,
    marginTop: Styles.getResponsiveSize(16, { small: 0, medium: 8 }),
    paddingLeft: 34,
    paddingRight: 40,
    flexDirection: 'column'
  },
  titleText: theme => ({
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 12 }),
    color: theme.colors.gray2,
    marginTop: 30
  }),
  envInfoCard: theme => ({
    marginTop: 16,
    justifyContent: 'center'
  }),
  expander: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  environment: {
    marginBottom: Styles.getResponsiveSize(24, { small: 16, medium: 20 })
  },
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
