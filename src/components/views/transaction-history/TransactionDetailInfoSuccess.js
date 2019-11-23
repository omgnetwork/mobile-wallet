import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText } from 'components/widgets'
import { Formatter } from 'common/utils'
import { BlockchainRenderer } from 'common/blockchain'

const TransactionDetailInfoSuccess = ({ theme, tx, style }) => {
  const textExactDatetime = Formatter.formatTimeStamp(
    tx.timestamp,
    'MMMM-DD-YYYY, HH:mm:ss A Z'
  )
  const textFromNowDatetime = Formatter.formatTimeStampFromNow(tx.timestamp)
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.greenTag(theme)}>
        <OMGText style={styles.greenTagText(theme)}>Success</OMGText>
      </View>
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme)}>
          {`${textExactDatetime} UTC`}
        </OMGText>
        <OMGText style={styles.infoItemValue(theme)} weight='bold'>
          {textFromNowDatetime}
        </OMGText>
      </View>
      <Divider theme={theme} />
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme)}>
          Total Value Transacted
        </OMGText>
        <OMGText style={styles.infoItemValue(theme)} weight='bold'>
          {BlockchainRenderer.renderTokenBalanceFromSmallestUnit(
            tx.value,
            tx.tokenDecimal
          )}{' '}
          {tx.tokenSymbol}
        </OMGText>
      </View>
      <Divider theme={theme} />
      <View style={styles.infoItem}>
        <OMGText style={styles.infoItemLabel(theme)}>TXN Fee</OMGText>
        <OMGText style={styles.infoItemValue(theme)} weight='bold'>
          {BlockchainRenderer.renderGasFee(tx.gasUsed, tx.gasPrice)} ETH
        </OMGText>
      </View>
    </View>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.green1,
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
  infoItem: {
    marginTop: 16,
    marginHorizontal: 10
  },
  infoItemLabel: theme => ({
    color: theme.colors.gray2
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

export default TransactionDetailInfoSuccess
