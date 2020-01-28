import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { OMGQRCode, OMGText, OMGIdenticon } from 'components/widgets'

const ShowQR = ({ theme, primaryWallet, primaryWalletAddress, navigation }) => {
  return (
    <View style={styles.container(theme)}>
      <View style={styles.titleContainer}>
        <OMGIdenticon
          style={styles.identicon(theme)}
          hash={primaryWalletAddress}
          size={40}
        />
        <OMGText style={styles.title(theme)} weight='mono-bold'>
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
        onPress={() => navigation.navigate('TransactionHistory')}>
        <OMGText style={styles.bottomText(theme)}>
          View Transaction History
        </OMGText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
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
)(withNavigation(withTheme(ShowQR)))
