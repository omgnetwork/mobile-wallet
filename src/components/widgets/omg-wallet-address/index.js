import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import OMGImage from '../omg-image'

const OMGWalletAddress = ({ theme, wallet, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGImage
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${wallet.address}.png`
        }}
      />
      <Text style={styles.text(theme)}>{wallet.name}</Text>
      <View style={styles.rightContainer}>
        <Text
          style={styles.address(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {wallet.address}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
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
  address: theme => ({
    color: theme.colors.grey2,
    maxWidth: 128,
    marginRight: 10
  }),
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    textTransform: 'uppercase',
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGWalletAddress)
