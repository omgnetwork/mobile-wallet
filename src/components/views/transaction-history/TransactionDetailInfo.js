import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText } from 'components/widgets'
import { Formatter } from 'common/utils'
import { BlockchainDataFormatter, Plasma } from 'common/blockchain'
import { connect } from 'react-redux'
import { priceService } from 'common/services'

const TransactionDetailInfo = ({ theme, tx, style, primaryWallet }) => {
  const [errorReason, setErrorReason] = useState(null)
  const [feePrice, setFeePrice] = useState(null)
  const tokens = primaryWallet.childchainAssets
  const textExactDatetime = Formatter.formatTimeStamp(
    tx.timestamp,
    'MMMM-DD-YYYY, HH:mm:ss A Z'
  )
  const feeAmount = BlockchainDataFormatter.formatGasFee(
    tx.gasUsed,
    tx.gasPrice,
    tx.flatFee
  )
  const textFromNowDatetime = Formatter.formatTimeStampFromNow(tx.timestamp)
  const isFailed = tx.type === 'failed'

  const getFeeTokenSymbol = useCallback(() => {
    return (
      tokens.find(token => token.contractAddress === tx.gasCurrency)
        ?.tokenSymbol ?? 'ETH'
    )
  }, [tokens, tx.gasCurrency])

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
    async function calculateFeePrice() {
      const price = await priceService.fetchPriceUsd(tx.gasCurrency)
      const feeUsd = BlockchainDataFormatter.formatGasFeeUsd(
        tx.gasUsed,
        tx.gasPrice,
        price
      )
      setFeePrice(feeUsd)
    }
    calculateFeePrice()
  })

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
        <OMGText style={styles.infoItemLabel(theme, isFailed)}>Fee</OMGText>
        <View style={styles.infoItemContent}>
          <OMGText style={styles.infoItemValue(theme)}>
            {feeAmount} {getFeeTokenSymbol()}
          </OMGText>
          <OMGText style={styles.infoItemValueLighter(theme)}>
            {feePrice} USD
          </OMGText>
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
        return 'Out of gas'
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
        <View style={styles.infoItemContent}>
          <OMGText style={styles.infoItemValue(theme)}>
            {textFromNowDatetime}
          </OMGText>
        </View>
      </View>
      <Divider theme={theme} />
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme, isFailed)}>
          Transact Value
        </OMGText>
        <View style={styles.infoItemContent}>
          <OMGText style={styles.infoItemValue(theme)}>
            {BlockchainDataFormatter.formatTokenBalanceFromSmallestUnit(
              tx.smallestValue || tx.value,
              tx.tokenDecimal
            )}{' '}
            {tx.tokenSymbol}
          </OMGText>
        </View>
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
    backgroundColor: theme.colors.gray7,
    padding: 16
  }),
  greenTag: theme => ({
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.green3
  }),
  greenTagText: theme => ({
    fontSize: 12,
    letterSpacing: -0.12,
    color: theme.colors.black5
  }),
  redTag: theme => ({
    alignSelf: 'flex-start',
    padding: 4,
    backgroundColor: theme.colors.red,
    borderRadius: theme.roundness
  }),
  redTagText: theme => ({
    color: theme.colors.white
  }),
  infoItem: {
    marginTop: 16
  },
  errorText: theme => ({
    color: theme.colors.red
  }),
  infoItemLabel: theme => ({
    fontSize: 10,
    letterSpacing: -1,
    color: theme.colors.gray
  }),
  infoItemContent: {
    marginTop: 4,
    flexDirection: 'row'
  },
  infoItemValue: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    marginTop: 4,
    color: theme.colors.white
  }),
  infoItemValueLighter: theme => ({
    fontSize: 16,
    marginLeft: 'auto',
    letterSpacing: -0.64,
    marginTop: 4,
    color: theme.colors.gray6
  }),
  divider: theme => ({
    backgroundColor: theme.colors.gray5,
    height: 1,
    marginTop: 16
  })
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(TransactionDetailInfo)
