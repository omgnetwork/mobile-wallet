import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon, OMGIdenticon } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGItemWallet = ({ wallet, style, theme, showCaret, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <OMGIdenticon
        hash={wallet.address}
        style={styles.identicon(theme)}
        size={40}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.name(theme)} weight='mono-bold'>
          {wallet.name}
        </OMGText>
        <OMGText style={styles.address(theme)} numberOfLines={1}>
          {wallet.address}
        </OMGText>
      </View>
      {showCaret && (
        <OMGFontIcon
          name='chevron-right'
          size={24}
          color={theme.colors.gray2}
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  identicon: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderColor: theme.colors.black4,
    borderWidth: 0.5
  }),
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
    fontSize: 12,
    marginRight: 32
  })
})

export default withTheme(OMGItemWallet)
