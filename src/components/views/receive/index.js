import React, { useCallback } from 'react'
import { View, TouchableOpacity, StyleSheet, Share } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'

import ShareIcon from './assets/share-icon.svg'
import CloseIcon from './assets/close-icon.svg'
import { OMGQRCode, OMGText, OMGIdenticon } from 'components/widgets'
import { Styles } from 'common/utils'

function Receive({ theme, primaryWallet, primaryWalletAddress, navigation }) {
  const handleShareClick = useCallback(() => {
    Share.share({
      title: 'Share Wallet Address',
      message: primaryWalletAddress
    })
  }, [primaryWalletAddress])

  const handleCloseClick = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const imageWidth = Styles.getResponsiveSize(24, { small: 16, medium: 18 })
  const imageHeight = Styles.getResponsiveSize(24, { small: 16, medium: 18 })

  return (
    <View style={styles.container(theme)}>
      <TouchableOpacity
        style={styles.closeButton(theme)}
        onPress={handleCloseClick}>
        <CloseIcon />
      </TouchableOpacity>
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
          size={Styles.getResponsiveSize(160, { small: 100, medium: 120 })}
          payload={primaryWalletAddress}
          displayText={primaryWalletAddress}
        />
      </View>
      <TouchableOpacity
        style={styles.buttonContainer(theme)}
        onPress={handleShareClick}>
        <ShareIcon
          width={imageWidth}
          height={imageHeight}
          style={styles.image}
        />
        <OMGText style={styles.buttonText(theme)} weigth='semi-bold'>
          SHARE QR
        </OMGText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
    backgroundColor: theme.colors.black
  }),
  closeButton: theme => ({
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    left: 30,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray3
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
    backgroundColor: theme.colors.gray4,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    paddingBottom: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    paddingLeft: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    paddingRight: Styles.getResponsiveSize(18, { small: 14, medium: 16 })
  }),
  image: {
    color: 'white',
    marginRight: 10
  },
  buttonText: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 })
  })
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  primaryWalletAddress: state.setting.primaryWalletAddress
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(Receive)))
