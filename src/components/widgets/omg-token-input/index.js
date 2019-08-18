import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGIcon from '../omg-icon'
import { formatter } from 'common/utils'

const OMGTokenInput = ({ theme, token, style }) => {
  return (
    <TouchableOpacity style={{ ...styles.container(theme), ...style }}>
      <OMGImage
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${token.symbol}.png`
        }}
      />
      <Text style={styles.text(theme)}>{token.tokenSymbol}</Text>
      <View style={styles.rightContainer}>
        <Text style={styles.amount(theme)}>
          {formatTokenBalance(token.balance)} {token.tokenSymbol}
        </Text>
        <OMGIcon name='chevron-right' size={14} color={theme.colors.icon} />
      </View>
    </TouchableOpacity>
  )
}

const formatTokenBalance = amount => {
  return formatter.format(amount, {
    commify: true,
    maxDecimal: 6,
    ellipsize: false
  })
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
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
  amount: theme => ({
    color: theme.colors.grey2,
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

export default withTheme(OMGTokenInput)
