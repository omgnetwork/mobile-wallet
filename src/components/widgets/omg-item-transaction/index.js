import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { Formatter, Datetime, Transaction } from 'common/utils'
import OMGText from '../omg-text'
import OMGIcon from '../omg-icon'

const OMGItemTransaction = ({ theme, tx, style, key, address }) => {
  const iconName = Transaction.isReceiveTx(address, tx.to)
    ? 'arrow-down'
    : 'arrow-up'
  return (
    <View style={{ ...styles.container(theme), ...style }} key={key}>
      <View style={styles.logo(theme)}>
        <OMGIcon name={iconName} size={14} />
      </View>
      <OMGText
        style={styles.hash(theme)}
        numberOfLines={1}
        ellipsizeMode='tail'>
        {tx.hash}
      </OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.amount(theme)}>
          {formatTokenBalance(tx.value, tx.tokenDecimal)} {tx.tokenSymbol}
        </OMGText>
        <OMGText style={styles.date(theme)}>
          {Datetime.format(
            Datetime.fromTimestamp(tx.timestamp),
            'MMM DD, HH:mm a'
          )}
        </OMGText>
      </View>
    </View>
  )
}

const formatTokenBalance = (value, tokenDecimal) => {
  const balance = Formatter.formatUnits(value, tokenDecimal)
  return Formatter.format(balance, {
    commify: true,
    maxDecimal: 3,
    ellipsize: false
  })
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center'
  }),
  logo: theme => ({
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.black4,
    marginRight: 16,
    borderWidth: 1,
    borderRadius: theme.roundness
  }),
  hash: theme => ({
    flex: 1,
    color: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24
  }),
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  amount: theme => ({
    color: theme.colors.primary
  }),
  date: theme => ({
    color: theme.colors.gray2,
    fontSize: 8
  })
})

export default withTheme(OMGItemTransaction)
