import React, { useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { Datetime } from 'common/utils'
import { TransactionTypes } from 'common/constants'
import { BlockchainRenderer } from 'common/blockchain'
import OMGText from '../omg-text'
import OMGFontIcon from '../omg-font-icon'

const OMGItemTransaction = ({ theme, tx, style, key, onPress }) => {
  const isError = tx.type === TransactionTypes.TYPE_FAILED
  const iconName = getIconName(tx.type)

  const renderValue = useCallback(() => {
    return `${BlockchainRenderer.renderTokenBalanceFromSmallestUnit(
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
      return 'upload'
    case TransactionTypes.TYPE_RECEIVED:
      return 'arrow-down'
    case TransactionTypes.TYPE_FAILED:
    case TransactionTypes.TYPE_SENT:
      return 'arrow-up'
    case TransactionTypes.TYPE_UNIDENTIFIED:
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
