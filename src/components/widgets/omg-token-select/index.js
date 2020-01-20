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
      <OMGTokenIcon token={token} size={32} />
      <View style={styles.sectionName}>
        <OMGText style={styles.symbol(theme)}>{token.tokenSymbol}</OMGText>
      </View>
      <View style={styles.sectionAmount}>
        <OMGText
          style={styles.balance(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {BlockchainRenderer.renderTokenBalance(token.balance, 4)}
        </OMGText>
        <OMGText style={styles.fiatValue(theme)}>
          {BlockchainRenderer.renderTokenPrice(token.balance, token.price)} USD
        </OMGText>
      </View>
      <View style={styles.sectionSelect}>
        {selected && (
          <OMGFontIcon name='check-mark' size={14} color={theme.colors.gray3} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: (theme, selected) => ({
    flexDirection: 'row',
    backgroundColor: selected ? theme.colors.blue1 : theme.colors.gray4,
    alignItems: 'center',
    padding: 20,
    borderRadius: theme.roundness,
    borderColor: selected ? theme.colors.blue1 : theme.colors.black4,
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
    fontSize: 14,
    color: theme.colors.primary
  }),
  balance: theme => ({
    textAlign: 'right',
    maxWidth: 100,
    fontSize: 14,
    color: theme.colors.primary
  }),
  fiatValue: theme => ({
    textAlign: 'right',
    color: theme.colors.black2,
    fontSize: 8
  })
})

export default withTheme(OMGTokenSelect)
