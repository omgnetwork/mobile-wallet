import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon, OMGTokenIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { BlockchainRenderer } from 'common/blockchain'

const OMGTokenSelect = ({ token, style, onPress, selected, theme }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme, selected), ...style }}
      onPress={onPress}>
      <OMGTokenIcon token={token} size={40} />
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
          {BlockchainRenderer.renderTokenBalance(token.balance, 4)}
        </OMGText>
        <OMGText style={styles.fiatValue(theme)} weight='mono-regular'>
          {BlockchainRenderer.renderTokenPrice(token.balance, token.price)} USD
        </OMGText>
      </View>
      <View style={styles.sectionSelect}>
        {selected && (
          <OMGFontIcon name='check-mark' size={14} color={theme.colors.white} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: (theme, selected) => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.gray4,
    alignItems: 'center',
    padding: 12,
    borderRadius: theme.roundness,
    borderColor: theme.colors.new_gray5,
    borderWidth: 1
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
    fontSize: 16,
    letterSpace: -0.64,
    color: theme.colors.white
  }),
  balance: theme => ({
    textAlign: 'right',
    maxWidth: 100,
    fontSize: 16,
    color: theme.colors.white
  }),
  fiatValue: theme => ({
    textAlign: 'right',
    color: theme.colors.new_gray7,
    fontSize: 12
  })
})

export default withTheme(OMGTokenSelect)
