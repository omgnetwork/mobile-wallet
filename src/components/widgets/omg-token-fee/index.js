import React from 'react'
import { StyleSheet, View } from 'react-native'
import { OMGText, OMGTokenIcon, OMGFontIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { BlockchainRenderer } from 'common/blockchain'

const OMGTokenFee = ({ token, theme, selected }) => {
  return (
    <View style={styles.container(theme)}>
      <OMGTokenIcon token={token} size={24} style={styles.iconToken} />
      <OMGText style={[styles.tokenName, styles.textWhite16(theme)]}>
        {token.tokenSymbol}
      </OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.textWhite16(theme)}>
          {BlockchainRenderer.renderTokenBalanceFromSmallestUnit(
            token.amount,
            token.tokenDecimal
          )}{' '}
          {token.tokenSymbol}
        </OMGText>
        <OMGText style={styles.textWhite12(theme)}>
          {BlockchainRenderer.renderTokenBalanceFromSmallestUnit(
            token.pegged_amount,
            Math.log10(token.pegged_subunit_to_unit)
          )}{' '}
          {token.pegged_currency}
        </OMGText>
        <OMGText style={styles.textGray12(theme)}>
          Balance{' '}
          {BlockchainRenderer.renderTokenBalance(
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.gray4,
    borderColor: theme.colors.new_gray5,
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
    color: theme.colors.new_gray7,
    marginTop: 12
  }),
  select: {
    width: 14,
    marginLeft: 20
  }
})

export default withTheme(OMGTokenFee)
