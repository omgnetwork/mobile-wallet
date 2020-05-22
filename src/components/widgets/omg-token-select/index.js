import React from 'react'
import { Styles } from 'common/utils'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon, OMGTokenIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { BlockchainFormatter } from 'common/blockchain'

const OMGTokenSelect = ({ token, style, onPress, selected, theme }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <OMGTokenIcon
        token={token}
        size={Styles.getResponsiveSize(32, { small: 16, medium: 24 })}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.symbol(theme)} weight='mono-regular'>
          {token.tokenSymbol}
        </OMGText>
      </View>
      <View style={styles.sectionAmount}>
        <OMGText
          style={styles.balance(theme)}
          ellipsizeMode='tail'
          weight='mono-regular'
          numberOfLines={1}>
          {BlockchainFormatter.formatTokenBalance(token.balance, 6)}
        </OMGText>
      </View>
      <View style={styles.sectionSelect}>
        {selected ? (
          <OMGFontIcon name='check-mark' size={14} color={theme.colors.white} />
        ) : (
          <OMGFontIcon
            name='chevron-right'
            size={14}
            color={theme.colors.white}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.black5,
    alignItems: 'center',
    paddingVertical: Styles.getResponsiveSize(16, { small: 8, medium: 12 })
  }),
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 16
  },
  sectionAmount: {
    flexDirection: 'column'
  },
  sectionSelect: {
    width: 14,
    marginLeft: 20
  },
  symbol: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: -0.64,
    color: theme.colors.white
  }),
  balance: theme => ({
    textAlign: 'right',
    maxWidth: 100,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    color: theme.colors.white
  }),
  fiatValue: theme => ({
    textAlign: 'right',
    color: theme.colors.gray6,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 12 })
  })
})

export default withTheme(OMGTokenSelect)
