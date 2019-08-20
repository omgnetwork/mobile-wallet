import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGText from '../omg-text'

const OMGWalletAddress = ({
  theme,
  wallet,
  colorName,
  colorAddress,
  style
}) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGImage
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${wallet.address}.png`
        }}
      />
      <OMGText style={styles.text(theme, colorName)}>{wallet.name}</OMGText>
      <View style={styles.rightContainer}>
        <OMGText
          style={styles.address(theme, colorAddress)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {wallet.address}
        </OMGText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundDisabled,
    borderColor: theme.colors.background,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  logo: {
    width: 26,
    height: 26,
    marginRight: 16
  },
  address: (theme, colorAddress) => ({
    color: colorAddress || theme.colors.gray2,
    maxWidth: 128,
    marginRight: 10
  }),
  text: (theme, colorName) => ({
    color: colorName || theme.colors.primary,
    fontSize: 14,
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGWalletAddress)
