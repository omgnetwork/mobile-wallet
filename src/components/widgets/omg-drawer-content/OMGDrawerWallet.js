import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGFontIcon, OMGIdenticon } from 'components/widgets'

const OMGDrawerWallet = ({ wallet, primary, onWalletPress, key, theme }) => {
  return (
    <TouchableOpacity
      key={key}
      style={styles.container}
      onPress={() => onWalletPress(wallet)}>
      <OMGIdenticon style={styles.logo} hash={wallet.address} size={32} />
      <OMGText style={styles.name(theme)}>{wallet.name}</OMGText>
      {primary && (
        <OMGFontIcon name='check-mark' size={14} style={styles.iconRight} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center'
  },
  logo: {
    width: 32,
    height: 32
  },
  name: theme => ({
    fontSize: 16,
    flex: 1,
    marginLeft: 16,
    color: theme.colors.black4
  }),
  iconRight: {
    marginRight: 30
  }
})

export default withTheme(OMGDrawerWallet)
