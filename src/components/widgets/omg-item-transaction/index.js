import React, { useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { Datetime, Styles } from 'common/utils'
import { TransactionTypes } from 'common/constants'
import { BlockchainFormatter } from 'common/blockchain'
import OMGText from '../omg-text'
import OMGFontIcon from '../omg-font-icon'

const OMGItemTransaction = ({ theme, tx, style, key, onPress }) => {
  const isError = tx.type === TransactionTypes.TYPE_FAILED
  const iconName = getIconName(tx.type)

  const renderValue = useCallback(() => {
    return `${BlockchainFormatter.formatTokenBalanceFromSmallestUnit(
      tx.value,
      tx.tokenDecimal
    )} ${tx.tokenSymbol}`
  }, [tx])

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(tx)}
      style={{ ...styles.container, ...style }}
      key={key}>
      <View style={styles.logo(theme, isError)}>
        <OMGFontIcon
          name={iconName}
          size={Styles.getResponsiveSize(14, { small: 10, medium: 12 })}
          color={isError ? theme.colors.red : theme.colors.white}
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
        <OMGText style={styles.textAmount(theme)}>{renderValue()}</OMGText>
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
    case TransactionTypes.TYPE_DEPOSIT:
      return 'download'
    case TransactionTypes.TYPE_EXIT:
    case TransactionTypes.TYPE_PROCESS_EXIT:
      return 'upload'
    case TransactionTypes.TYPE_RECEIVED:
      return 'arrow-down'
    case TransactionTypes.TYPE_FAILED:
    case TransactionTypes.TYPE_SENT:
      return 'arrow-up'
    default:
      return 'transaction'
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center'
  },
  logo: (theme, error) => ({
    width: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    height: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: error ? theme.colors.red : theme.colors.white,
    marginRight: 10,
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
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    }),
    color: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  subText: theme => ({
    color: theme.colors.gray8,
    fontSize: 10
  }),
  textAmount: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    }),
    color: theme.colors.white
  }),
  textDate: theme => ({
    color: theme.colors.gray2,
    fontSize: 8,
    letterSpacing: -0.32
  })
})

export default withTheme(OMGItemTransaction)
