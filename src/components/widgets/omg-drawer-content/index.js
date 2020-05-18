import React, { useCallback } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { SafeAreaView, withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { walletSwitcherActions } from 'common/actions'
import Config from 'react-native-config'
import { OMGText, OMGFontIcon, OMGIdenticon } from 'components/widgets'
import { ScrollView } from 'react-native-gesture-handler'
import Intercom from 'react-native-intercom'
import { hexToRgb } from 'common/styles/colors'
import { Styles, Alerter } from 'common/utils'
import DrawerMenuItem from './DrawerMenuItem'
import DrawerEnvItem from './DrawerEnvItem'
import { Alert, TransactionTypes } from 'common/constants'
import { IconShuffle } from './assets'

const OMGDrawerContent = ({
  navigation,
  primaryWallet,
  dispatchToggleWalletSwitcher,
  theme
}) => {
  const handleCopyClick = useCallback(() => {
    Clipboard.setString(primaryWallet.address)
    Alerter.show(Alert.SUCCESS_COPIED_ADDRESS)
  }, [primaryWallet.address])

  const closeDrawerAndNavigate = (destination, params = {}) => {
    navigation.navigate(destination, params)
    requestAnimationFrame(() => {
      navigation.closeDrawer()
    })
  }

  const openIntercom = () => {
    Intercom.registerUnidentifiedUser()
    Intercom.displayMessenger()
  }

  const openWalletSwitcher = useCallback(() => {
    dispatchToggleWalletSwitcher(true)
  }, [dispatchToggleWalletSwitcher])

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
          <DrawerMenuItem
            title='Transactions'
            onPress={() =>
              closeDrawerAndNavigate('TransactionHistoryFilter', {
                title: 'Transactions',
                types: [
                  TransactionTypes.TYPE_ALL,
                  TransactionTypes.TYPE_RECEIVED,
                  TransactionTypes.TYPE_SENT,
                  TransactionTypes.TYPE_FAILED
                ]
              })
            }
          />
          <View style={styles.divider(theme)} />
          <DrawerMenuItem
            title='Deposits'
            onPress={() =>
              closeDrawerAndNavigate('TransactionHistoryFilter', {
                title: 'Deposit',
                types: [TransactionTypes.TYPE_DEPOSIT]
              })
            }
          />
          <View style={styles.divider(theme)} />
          <DrawerMenuItem
            title='Withdraws'
            onPress={() =>
              closeDrawerAndNavigate('TransactionHistoryFilter', {
                title: 'Exit',
                types: [
                  TransactionTypes.TYPE_EXIT,
                  TransactionTypes.TYPE_PROCESS_EXIT
                ]
              })
            }
          />
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btn(theme)}
              onPress={openWalletSwitcher}>
              <IconShuffle color={theme.colors.white} size={12} />
              <OMGText style={styles.btnText(theme)} weight='book'>
                Change wallet
              </OMGText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingContainer} key={'setting-container'}>
          <OMGText weight='book' style={styles.titleText(theme)}>
            App
          </OMGText>
          <DrawerMenuItem
            title='Import Wallet'
            onPress={() => closeDrawerAndNavigate('ImportWallet')}
          />
          <View style={styles.divider(theme)} />
          <DrawerMenuItem
            title='Create Wallet'
            onPress={() => closeDrawerAndNavigate('CreateWallet')}
          />
          <View style={styles.divider(theme)} />
          <DrawerMenuItem
            title='Delete Wallet'
            onPress={() => closeDrawerAndNavigate('DeleteWallet')}
          />
          <View style={styles.divider(theme)} />
          <DrawerMenuItem
            title='Support/Feedback'
            showCaret={false}
            onPress={openIntercom}
          />
          <View style={styles.divider(theme)} />
          <View style={styles.expander} />
          <View style={styles.environment}>
            <OMGText style={styles.titleText(theme)} weight='book'>
              Environment Info
            </OMGText>
            <DrawerEnvItem
              title='Ethereum Network'
              value={Config.ETHEREUM_NETWORK}
            />
            <DrawerEnvItem
              title='Plasma Contract'
              value={Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS}
            />
            <DrawerEnvItem
              title='Watcher URL'
              value={Config.WATCHER_URL}
            />
            <DrawerEnvItem title='Version' value={Config.VERSION} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

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
  btnContainer: {
    alignItems: 'flex-start'
  },
  btn: theme => ({
    marginTop: 10,
    width: 'auto',
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 10,
    backgroundColor: theme.colors.blue3
  }),
  btnText: theme => ({
    fontSize: 12,
    marginLeft: 12,
    color: theme.colors.white
  }),
  titleText: theme => ({
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 12 }),
    color: theme.colors.gray2,
    marginTop: 30
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
  }
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  wallets: state.wallets,
  provider: state.setting.provider
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchToggleWalletSwitcher: visible =>
    walletSwitcherActions.toggle(dispatch, visible)
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(OMGDrawerContent)))
