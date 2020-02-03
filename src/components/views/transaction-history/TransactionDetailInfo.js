import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText } from 'components/widgets'
import { Formatter } from 'common/utils'
import { BlockchainRenderer, Plasma } from 'common/blockchain'
import { priceService } from 'common/services'

const TransactionDetailInfo = ({ theme, tx, style }) => {
  const [errorReason, setErrorReason] = useState(null)
  const [feePrice, setFeePrice] = useState(false)

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
          <OMGText style={styles.greenTagText(theme)} weight='regular'>
            Success
          </OMGText>
        </View>
      )
    }
  }

  useEffect(() => {
    async function getErrorReason() {
      const reason = await Plasma.getErrorReason(tx.hash)
      console.log(reason)
      setErrorReason(reason)
    }
    if (isFailed) {
      getErrorReason()
    }
  }, [isFailed, tx.hash])

  const renderFee = () => {
    return (
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme, isFailed)}>Fee</OMGText>
        <View style={styles.infoItemContent}>
          <OMGText style={styles.infoItemValue(theme)}>
            {BlockchainRenderer.renderGasFee(
              tx.gasUsed,
              tx.gasPrice,
              tx.flatFee
            )}{' '}
            ETH
          </OMGText>
          <OMGText style={styles.infoItemValueLighter(theme)}>0.12 USD</OMGText>
        </View>
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
    <View style={{ ...styles.container(theme), ...style }}>
      {renderLabel()}
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme)}>
          {`${textExactDatetime} UTC`}
        </OMGText>
        <OMGText style={styles.infoItemValue(theme)}>
          {textFromNowDatetime}
        </OMGText>
      </View>
      <Divider theme={theme} />
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme, isFailed)}>
          Transact Value
        </OMGText>
        <OMGText style={styles.infoItemValue(theme)}>
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
  container: theme => ({
    backgroundColor: theme.colors.new_gray8,
    padding: 16
  }),
  greenTag: theme => ({
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.new_green3
  }),
  greenTagText: theme => ({
    fontSize: 12,
    letterSpacing: -0.12,
    color: theme.colors.gray4
  }),
  redTag: theme => ({
    alignSelf: 'flex-start',
    padding: 4,
    backgroundColor: theme.colors.red2,
    borderRadius: theme.roundness
  }),
  redTagText: theme => ({
    color: theme.colors.white
  }),
  infoItem: {
    marginTop: 16
  },
  errorText: theme => ({
    color: theme.colors.red5
  }),
  infoItemLabel: theme => ({
    fontSize: 10,
    letterSpacing: -1,
    color: theme.colors.new_gray1
  }),
  infoItemContent: {
    marginTop: 4,
    flexDirection: 'row'
  },
  infoItemValue: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.white
  }),
  infoItemValueLighter: theme => ({
    fontSize: 16,
    marginLeft: 'auto',
    letterSpacing: -0.64,
    color: theme.colors.new_gray7
  }),
  divider: theme => ({
    backgroundColor: theme.colors.new_gray6,
    height: 1,
    marginTop: 16
  })
})

export default TransactionDetailInfo
