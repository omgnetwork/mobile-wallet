import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { OMGQRCode, OMGBackground, OMGText } from 'components/widgets'

const ShowQR = ({ theme, primaryWallet, primaryWalletAddress }) => {
  return (
    <OMGBackground style={styles.container(theme)}>
      <View style={styles.titleContainer}>
        <Image
          style={styles.logo(theme)}
          source={{
            uri: `https://api.adorable.io/avatars/285/${primaryWalletAddress}.png`
          }}
        />
        <OMGText style={styles.title(theme)} weight='bold'>
          {primaryWallet.name}
        </OMGText>
      </View>
      <View style={styles.qrContainer}>
        <OMGQRCode
          payload={primaryWalletAddress}
          displayText={primaryWalletAddress}
        />
      </View>
      <OMGText style={styles.bottomText(theme)}>
        View Transaction History
      </OMGText>
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: theme.roundness
  }),
  logo: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderWidth: 0.5
  }),
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  icon: {
    width: 40,
    height: 40
  },
  qrContainer: {
    alignItems: 'center'
  },
  title: theme => ({
    textTransform: 'uppercase',
    fontSize: 18,
    marginTop: 16,
    color: theme.colors.gray3
  }),
  bottomText: theme => ({
    color: theme.colors.primary,
    alignSelf: 'center'
  })
})

const mapStateToProps = (state, ownProps) => ({
  primaryWalletAddress: state.setting.primaryWalletAddress,
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withTheme(ShowQR))