import React from 'react'
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native'
import OMGText from '../omg-text'
import OMGIcon from '../omg-icon'
import { withTheme } from 'react-native-paper'

const OMGItemWallet = ({ wallet, style, theme, showCaret, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <Image
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${wallet.address}.png`
        }}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.name(theme)} weight='bold'>
          {wallet.name}
        </OMGText>
        <OMGText style={styles.address(theme)}>{wallet.address}</OMGText>
      </View>
      {showCaret && <OMGIcon name='chevron-right' size={24} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 64,
    height: 64,
    borderRadius: 12
  },
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.white3,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: theme.roundness
  }),
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 16
  },
  name: theme => ({
    fontSize: 16,
    color: theme.colors.primary
  }),
  address: theme => ({
    color: theme.colors.gray5,
    fontSize: 12
  })
})

export default withTheme(OMGItemWallet)
