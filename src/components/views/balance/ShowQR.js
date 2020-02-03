import React, { useCallback } from 'react'
import { View, TouchableOpacity, StyleSheet, Share } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { OMGQRCode, OMGText, OMGIdenticon } from 'components/widgets'

const ShowQR = ({ theme, primaryWallet, primaryWalletAddress, navigation }) => {
  const handleShareClick = useCallback(() => {
    Share.share({
      title: 'Share Wallet Address',
      message: primaryWalletAddress
    })
  }, [primaryWalletAddress])
  return (
    <View style={styles.container(theme)}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <OMGIdenticon
            style={styles.identicon(theme)}
            hash={primaryWalletAddress}
            size={40}
          />
          <OMGText style={styles.title(theme)} weight='mono-semi-bold'>
            {primaryWallet.name}
          </OMGText>
        </View>
        <View style={styles.qrContainer(theme)}>
          <OMGQRCode
            payload={primaryWalletAddress}
            displayText={primaryWalletAddress}
          />
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.new_black7,
    borderRadius: theme.roundness
  }),
  identicon: theme => ({
    borderColor: theme.colors.new_gray1,
    borderRadius: theme.roundness,
    borderWidth: 1
  }),
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  contentContainer: {
    width: 200,
    flex: 1,
    justifyContent: 'center'
  },
  icon: {
    width: 40,
    height: 40
  },
  qrContainer: theme => ({
    alignItems: 'center',
    padding: 4
  }),
  title: theme => ({
    textTransform: 'uppercase',
    fontSize: 18,
    marginTop: 16,
    color: theme.colors.white
  }),
  buttonContainer: theme => ({
    borderWidth: 1,
    borderColor: theme.colors.new_gray5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14
  }),
  buttonText: theme => ({
    color: theme.colors.white
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
