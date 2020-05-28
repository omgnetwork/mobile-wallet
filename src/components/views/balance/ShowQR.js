import React, { useCallback } from 'react'
import { View, TouchableOpacity, StyleSheet, Share } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { OMGQRCode, OMGText, OMGIdenticon } from 'components/widgets'
import { Styles } from 'common/utils'

const ShowQR = ({
  theme,
  primaryWallet,
  primaryWalletAddress,
  navigation,
  anchoredRef
}) => {
  const handleShareClick = useCallback(() => {
    Share.share({
      title: 'Share your wallet address',
      message: primaryWalletAddress
    })
  }, [primaryWalletAddress])
  return (
    <View style={styles.container(theme)}>
      <View style={styles.titleContainer}>
        <OMGIdenticon
          style={styles.identicon(theme)}
          hash={primaryWalletAddress}
          size={Styles.getResponsiveSize(40, { small: 24, medium: 32 })}
        />
        <OMGText style={styles.title(theme)} weight='mono-semi-bold'>
          {primaryWallet.name}
        </OMGText>
      </View>
      <View style={styles.qrContainer}>
        <OMGQRCode
          payload={primaryWalletAddress}
          displayText={primaryWalletAddress}
        />
      </View>
      <View ref={anchoredRef}>
        <TouchableOpacity
          style={styles.buttonContainer(theme)}
          onPress={handleShareClick}>
          <OMGText style={styles.buttonText(theme)} weigth='semi-bold'>
            Share QR Code
          </OMGText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
    backgroundColor: theme.colors.black3,
    borderRadius: theme.roundness
  }),
  identicon: theme => ({
    borderColor: theme.colors.gray,
    borderRadius: theme.roundness,
    borderWidth: 1
  }),
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  qrContainer: theme => ({
    alignItems: 'center',
    padding: 4
  }),
  title: theme => ({
    textTransform: 'uppercase',
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    marginTop: 16,
    color: theme.colors.white
  }),
  buttonContainer: theme => ({
    borderWidth: 1,
    borderColor: theme.colors.gray4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    padding: Styles.getResponsiveSize(14, { small: 10, medium: 12 })
  }),
  buttonText: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 })
  })
})

const mapStateToProps = (state, ownProps) => ({
  primaryWalletAddress: state.setting.primaryWalletAddress,
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(ShowQR)))
