import React, { useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { TransactionTypes, ExitStatus } from 'common/constants'
import { BlockchainFormatter } from 'common/blockchain'
import OMGText from '../omg-text'
import OMGFontIcon from '../omg-font-icon'

const OMGItemExitTransaction = ({ theme, tx, style, key, onPress }) => {
  const isError = tx.type === TransactionTypes.TYPE_FAILED
  const iconName = getIconName(tx.type)

  const renderValue = useCallback(() => {
    return `${BlockchainFormatter.formatTokenBalance(tx.value)} ${
      tx.tokenSymbol
    }`
  }, [tx])

  const renderTransactionStatusIfNeeded = useCallback(() => {
    const { type, status, exitableAt } = tx
    switch (type) {
      case TransactionTypes.TYPE_EXIT:
        if (status === ExitStatus.EXIT_STARTED) {
          return (
            <View style={styles.exitStatusContainer}>
              <View style={styles.statusIndicator(theme)} />
              <OMGText style={styles.statusText(theme)}>
                {`Pending : Eligible to process on${BlockchainFormatter.formatProcessExitAt(
                  exitableAt
                )}`}
              </OMGText>
            </View>
          )
        }
        break
      case TransactionTypes.TYPE_FAILED:
        return <OMGText style={styles.subText(theme)}>Failed</OMGText>
    }
  }, [theme, tx])

  const renderAmountOrProcessExit = useCallback(() => {
    const { type, status } = tx
    if (
      type === TransactionTypes.TYPE_EXIT &&
      status === ExitStatus.EXIT_READY
    ) {
      return (
        <View style={styles.processExitContainer(theme)}>
          <OMGText style={styles.processExitText(theme)}>Process Exit</OMGText>
        </View>
      )
    } else {
      return <OMGText style={styles.textAmount(theme)}>{renderValue()}</OMGText>
    }
  }, [renderValue, theme, tx])

  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(tx)}
      style={{ ...styles.container, ...style }}
      key={key}>
      <View style={styles.logo(theme, isError)}>
        <OMGFontIcon
          name={iconName}
          size={14}
          color={isError ? theme.colors.red : theme.colors.white}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.topContainer}>
          <OMGText
            style={styles.textHash(theme)}
            numberOfLines={1}
            ellipsizeMode='tail'>
            {tx.hash}
          </OMGText>
          {renderAmountOrProcessExit()}
        </View>
        {renderTransactionStatusIfNeeded()}
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
    borderColor: error ? theme.colors.red : theme.colors.white,
    marginRight: 10,
    borderWidth: 1,
    borderRadius: theme.roundness
  }),
  contentContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  exitStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  statusIndicator: theme => ({
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.yellow2
  }),
  statusText: theme => ({
    marginLeft: 4,
    fontSize: 8,
    letterSpacing: -0.32,
    color: theme.colors.gray2
  }),
  textHash: theme => ({
    fontSize: 16,
    width: 171,
    letterSpacing: -0.64,
    color: theme.colors.white
  }),
  processExitContainer: theme => ({
    padding: 6,
    marginLeft: 'auto',
    backgroundColor: theme.colors.primary
  }),
  processExitText: theme => ({
    color: theme.colors.white,
    fontSize: 12,
    letterSpacing: -0.48
  }),
  subText: theme => ({
    color: theme.colors.gray8,
    fontSize: 10
  }),
  textAmount: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    marginLeft: 'auto',
    color: theme.colors.white
  })
})

export default withTheme(OMGItemExitTransaction)
