import React, { useCallback, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Share,
  TouchableOpacity,
  Keyboard
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { withNavigationFocus } from 'react-navigation'
import {
  OMGQRCode,
  OMGText,
  OMGFontIcon,
  OMGIdenticon
} from 'components/widgets'
import { Alert } from 'common/constants'
import { Alerter, Styles } from 'common/utils'

const TransferReceive = ({
  theme,
  primaryWallet,
  primaryWalletAddress,
  isFocused
}) => {
  useEffect(() => {
    if (isFocused) {
      Keyboard.dismiss()
    }
  }, [isFocused])

  const handleCopyClick = useCallback(() => {
    Clipboard.setString(primaryWalletAddress)
    Alerter.show(Alert.SUCCESS_COPIED_ADDRESS)
  }, [primaryWalletAddress])

  const handleShareClick = useCallback(() => {
    Share.share({
      title: 'Share Wallet Address',
      message: primaryWalletAddress
    })
  }, [primaryWalletAddress])

  return (
    <View style={styles.container(theme)}>
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <OMGIdenticon
            style={styles.identicon(theme)}
            hash={primaryWalletAddress}
            size={Styles.getResponsiveSize(40, { small: 24, medium: 32 })}
          />
          <OMGText style={styles.title(theme)}>{primaryWallet.name}</OMGText>
          <View style={styles.qrContainer(theme)}>
            <OMGQRCode
              size={Styles.getResponsiveSize(160, { small: 100, medium: 120 })}
              payload={primaryWalletAddress}
            />
          </View>
          <View style={styles.walletAddress}>
            <OMGText style={styles.text(theme)}>{primaryWalletAddress}</OMGText>
            <TouchableOpacity onPress={handleCopyClick}>
              <OMGFontIcon
                name='copy'
                size={24}
                color={theme.colors.white}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer(theme)}
          onPress={handleShareClick}>
          <OMGText style={styles.buttonText(theme)} weigth='semi-bold'>
            Share to Receive
          </OMGText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black3,
    alignItems: 'center'
  }),
  contentContainer: {
    width: Styles.getResponsiveSize(200, { small: 168, medium: 188 }),
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center'
  },
  identicon: theme => ({
    width: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    height: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    borderRadius: theme.roundness,
    borderWidth: 0.5,
    borderColor: theme.colors.gray
  }),
  qrContainer: theme => ({
    marginTop: Styles.getResponsiveSize(24, { small: 8, medium: 16 }),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: theme.roundness,
    borderBottommRightRadius: theme.roundness
  }),
  title: theme => ({
    textTransform: 'uppercase',
    fontSize: Styles.getResponsiveSize(16, { small: 14, medium: 14 }),
    marginTop: Styles.getResponsiveSize(20, { small: 12, medium: 16 }),
    color: theme.colors.white
  }),
  walletAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: theme => ({
    flex: 1,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 10 }),
    letterSpacing: -0.48,
    color: theme.colors.white
  }),
  icon: { marginLeft: 12 },
  buttonContainer: theme => ({
    width: Styles.getResponsiveSize(200, { small: 168, medium: 188 }),
    borderWidth: 1,
    borderColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    padding: 12
  }),
  buttonText: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 })
  })
})

const mapStateToProps = (state, _ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  primaryWalletAddress: state.setting.primaryWalletAddress,
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(TransferReceive)))
