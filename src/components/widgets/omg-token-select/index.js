import React from 'react'
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native'
import OMGBox from '../omg-box'
import OMGText from '../omg-text'
import OMGIcon from '../omg-icon'
import { withTheme } from 'react-native-paper'
import { Formatter } from 'common/utils'

const OMGTokenSelect = ({ token, style, onPress, selected, theme }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme, selected), ...style }}
      onPress={onPress}>
      <Image
        style={styles.logo(theme)}
        source={{
          uri: `https://api.adorable.io/avatars/285/${token.tokenSymbol}.png`
        }}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.symbol(theme)}>{token.tokenSymbol}</OMGText>
      </View>
      <View style={styles.sectionAmount}>
        <OMGText
          style={styles.balance(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {formatTokenBalance(token.balance)}
        </OMGText>
        <OMGText style={styles.fiatValue(theme)}>
          {formatTokenPrice(token.balance, token.price)} USD
        </OMGText>
      </View>
      <View style={styles.sectionSelect}>
        {selected && (
          <OMGIcon name='check-mark' size={14} color={theme.colors.gray3} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const formatTokenBalance = amount => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: 3,
    ellipsize: false
  })
}

const formatTokenPrice = (amount, price) => {
  const parsedAmount = parseFloat(amount)
  const tokenPrice = parsedAmount * price
  return Formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const styles = StyleSheet.create({
  logo: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderWidth: 0.5
  }),
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
