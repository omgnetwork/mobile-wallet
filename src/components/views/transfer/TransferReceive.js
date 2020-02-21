import React, { useCallback, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Clipboard,
  Share,
  TouchableOpacity,
  Keyboard
} from 'react-native'
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
import { Alerter } from 'common/utils'

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
      <View style={styles.contentContainer(theme)}>
        <View style={styles.content}>
          <OMGIdenticon
            style={styles.identicon(theme)}
            hash={primaryWalletAddress}
            size={40}
          />
          <OMGText style={styles.title(theme)}>{primaryWallet.name}</OMGText>
          <View style={styles.qrContainer(theme)}>
            <OMGQRCode size={192} payload={primaryWalletAddress} />
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
  contentContainer: theme => ({
    width: 200,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  content: {
    alignItems: 'center'
  },
  identicon: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderWidth: 0.5,
    borderColor: theme.colors.gray
  }),
  qrContainer: theme => ({
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: theme.roundness,
    borderBottommRightRadius: theme.roundness
  }),
  title: theme => ({
    textTransform: 'uppercase',
    fontSize: 16,
    marginTop: 20,
    color: theme.colors.white
  }),
  walletAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: theme => ({
    flex: 1,
    fontSize: 12,
    letterSpacing: -0.48,
    color: theme.colors.white
  }),
  icon: { marginLeft: 18 },
  buttonContainer: theme => ({
    width: 200,
    borderWidth: 1,
    borderColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    padding: 14
  }),
  buttonText: theme => ({
    color: theme.colors.white
  })
})

const mapStateToProps = (state, ownProps) => ({
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
