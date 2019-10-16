import React, { useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { Formatter, Datetime } from 'common/utils'
import OMGText from '../omg-text'
import OMGIcon from '../omg-icon'

const OMGItemTransaction = ({ theme, tx, style, key, onPress }) => {
  const isError = tx.type === 'failed'
  const iconName = getIconName(tx.type)

  const renderEthereumValue = useCallback(() => {
    return `${formatTokenBalance(tx.value, tx.tokenDecimal)} ${tx.tokenSymbol}`
  }, [tx.tokenDecimal, tx.tokenSymbol, tx.value])

  const renderOmiseGOValue = useCallback(() => {
    return `? ${tx.tokenSymbol}`
  }, [tx.tokenSymbol])

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(tx)}
      style={{ ...styles.container, ...style }}
      key={key}>
      <View style={styles.logo(theme, isError)}>
        <OMGIcon
          name={iconName}
          size={14}
          color={isError ? theme.colors.red : theme.colors.black5}
        />
      </View>
      <View style={styles.centerContainer}>
        <OMGText
          style={styles.textHash(theme)}
          numberOfLines={1}
          ellipsizeMode='tail'>
          {tx.hash}
        </OMGText>
        {isError && <OMGText style={styles.subText(theme)}>Failed</OMGText>}
      </View>
      <View style={styles.rightContainer}>
        <OMGText style={styles.textAmount(theme)}>
          {tx.network === 'ethereum'
            ? renderEthereumValue()
            : renderOmiseGOValue()}
        </OMGText>
        <OMGText style={styles.textDate(theme)}>
          {Datetime.format(
            Datetime.fromTimestamp(tx.timestamp),
            'MMM DD, HH:mm a'
          )}
        </OMGText>
      </View>
    </TouchableOpacity>
  )
}

const getIconName = type => {
  switch (type) {
    case 'deposit':
      return 'download'
    case 'exit':
      return 'upload'
    case 'in':
      return 'arrow-down'
    case 'failed':
    case 'out':
      return 'arrow-up'
    case 'unidentified':
    default:
      return 'transaction'
  }
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
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center'
  },
  logo: (theme, error) => ({
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: error ? theme.colors.red : theme.colors.black4,
    marginRight: 16,
    borderWidth: 1,
    borderRadius: theme.roundness
  }),
  centerContainer: {
    flex: 1,
    marginRight: 24,
    flexDirection: 'column'
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  textHash: theme => ({
    color: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  subText: theme => ({
    color: theme.colors.gray2,
    fontSize: 10
  }),
  textAmount: theme => ({
    color: theme.colors.primary
  }),
  textDate: theme => ({
    color: theme.colors.gray2,
    fontSize: 8
  })
})

export default withTheme(OMGItemTransaction)
