import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OMGText, OMGTokenIcon, OMGFontIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { BlockchainDataFormatter } from 'common/blockchain'

const OMGTokenFee = ({ token, theme, selected, onPress }) => {
  const displayAmount = BlockchainDataFormatter.formatTokenBalanceFromSmallestUnit(
    token.amount,
    token.tokenDecimal,
    token.tokenDecimal
  )
  return (
    <TouchableOpacity style={styles.container(theme)} onPress={onPress}>
      <OMGTokenIcon token={token} size={24} style={styles.iconToken} />
      <OMGText style={[styles.tokenName, styles.textWhite16(theme)]}>
        {token.tokenSymbol}
      </OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.textWhite16(theme)}>
          {displayAmount} {token.tokenSymbol}
        </OMGText>
        <OMGText style={styles.textWhite12(theme)}>
          {BlockchainDataFormatter.formatTokenPrice(displayAmount, token.price)}{' '}
          USD
        </OMGText>
        <OMGText style={[styles.textGray12(theme), styles.marginTop12]}>
          Balance{' '}
          {BlockchainDataFormatter.formatTokenBalance(
            token.balance,
            token.tokenDecimal
          )}{' '}
          {token.tokenSymbol}
        </OMGText>
      </View>
      <View style={styles.select}>
        {selected && (
          <OMGFontIcon name='check-mark' size={14} color={theme.colors.white} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.black5,
    borderColor: theme.colors.gray4,
    borderWidth: 1,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row'
  }),
  rightContainer: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginLeft: 'auto'
  },
  tokenName: {
    marginLeft: 12
  },
  iconToken: {
    width: 24,
    height: 24
  },
  textWhite16: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.white
  }),
  textWhite12: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    color: theme.colors.white
  }),
  textGray12: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    color: theme.colors.gray6
  }),
  marginTop12: {
    marginTop: 12
  },
  select: {
    width: 14,
    marginLeft: 12
  }
})

export default withTheme(OMGTokenFee)
