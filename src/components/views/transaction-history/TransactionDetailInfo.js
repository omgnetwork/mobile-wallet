import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText } from 'components/widgets'
import { Formatter } from 'common/utils'
import { BlockchainRenderer, Plasma } from 'common/blockchain'

const TransactionDetailInfo = ({ theme, tx, style }) => {
  const [errorReason, setErrorReason] = useState(null)
  const textExactDatetime = Formatter.formatTimeStamp(
    tx.timestamp,
    'MMMM-DD-YYYY, HH:mm:ss A Z'
  )
  const textFromNowDatetime = Formatter.formatTimeStampFromNow(tx.timestamp)
  const isFailed = tx.type === 'failed'

  const renderLabel = () => {
    if (isFailed) {
      return (
        <View style={styles.redTag(theme)}>
          <OMGText style={styles.redTagText(theme)}>Failed</OMGText>
        </View>
      )
    } else {
      return (
        <View style={styles.greenTag(theme)}>
          <OMGText style={styles.greenTagText(theme)}>Success</OMGText>
        </View>
      )
    }
  }

  useEffect(() => {
    async function getErrorReason() {
      const reason = await Plasma.getErrorReason(tx.hash)
      setErrorReason(reason)
    }
    if (isFailed) {
      getErrorReason()
    }
  }, [isFailed, tx.hash])

  const renderFee = () => {
    return (
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme, isFailed)}>TXN Fee</OMGText>
        <OMGText style={styles.infoItemValue(theme)} weight='mono-bold'>
          {BlockchainRenderer.renderGasFee(tx.gasUsed, tx.gasPrice, tx.flatFee)}{' '}
          ETH
        </OMGText>
      </View>
    )
  }

  const renderReasonText = () => {
    switch (errorReason) {
      case '':
        return "50% of the time, it doesn't work every time"
      case null:
        return 'Fetching...'
      default:
        return errorReason
    }
  }

  const renderErrorReason = () => {
    return (
      <View style={styles.infoItem}>
        <OMGText style={styles.errorText(theme)}>Error</OMGText>
        <OMGText style={styles.infoItemValue(theme)}>
          {renderReasonText()}
        </OMGText>
      </View>
    )
  }

  return (
    <View style={{ ...styles.container(theme, isFailed), ...style }}>
      {renderLabel()}
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme, isFailed)}>
          {`${textExactDatetime} UTC`}
        </OMGText>
        <OMGText style={styles.infoItemValue(theme)} weight='mono-bold'>
          {textFromNowDatetime}
        </OMGText>
      </View>
      <Divider theme={theme} />
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme, isFailed)}>
          Total Value Transacted
        </OMGText>
        <OMGText style={styles.infoItemValue(theme)} weight='mono-bold'>
          {BlockchainRenderer.renderTokenBalanceFromSmallestUnit(
            tx.value,
            tx.tokenDecimal
          )}{' '}
          {tx.tokenSymbol}
        </OMGText>
      </View>
      <Divider theme={theme} />
      {isFailed ? renderErrorReason() : renderFee()}
    </View>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  container: (theme, isFailed) => ({
    backgroundColor: isFailed ? theme.colors.red4 : theme.colors.green1,
    borderRadius: theme.roundness,
    paddingVertical: 16
  }),
  greenTag: theme => ({
    alignSelf: 'flex-start',
    padding: 4,
    marginLeft: 8,
    backgroundColor: theme.colors.green2,
    borderRadius: theme.roundness
  }),
  greenTagText: theme => ({
    color: theme.colors.white
  }),
  redTag: theme => ({
    alignSelf: 'flex-start',
    padding: 4,
    marginLeft: 8,
    backgroundColor: theme.colors.red2,
    borderRadius: theme.roundness
  }),
  redTagText: theme => ({
    color: theme.colors.white
  }),
  infoItem: {
    marginTop: 16,
    marginHorizontal: 10
  },
  errorText: theme => ({
    color: theme.colors.red5
  }),
  infoItemLabel: (theme, isFailed) => ({
    color: isFailed ? theme.colors.gray5 : theme.colors.gray2
  }),
  infoItemValue: theme => ({
    color: theme.colors.primary
  }),
  divider: theme => ({
    opacity: 0.25,
    backgroundColor: theme.colors.black1,
    height: 1,
    marginTop: 16
  })
})

export default TransactionDetailInfo
