import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGIcon, OMGText } from 'components/widgets'
import { Formatter } from 'common/utils'

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const TransactionDetailFromTo = ({ theme, tx, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.detailContainer}>
        <OMGText style={styles.title(theme)}>From</OMGText>
        <View style={styles.detailItem}>
          <OMGIcon name='wallet' size={14} />
          <OMGText
            numberOfLines={1}
            ellipsizeMode='tail'
            style={styles.detailItemAddressText(theme)}>
            {tx.from}
          </OMGText>
          <OMGText style={styles.detailItemValueText(theme)}>
            {formatTokenBalance(tx.value, tx.tokenDecimal)} {tx.tokenSymbol}
          </OMGText>
        </View>
      </View>
      <Divider theme={theme} />
      <View style={styles.detailContainer}>
        <OMGText style={styles.title(theme)}>To</OMGText>
        <View style={styles.detailItem}>
          <OMGIcon name='wallet' size={14} />
          <OMGText
            numberOfLines={1}
            ellipsizeMode='tail'
            style={styles.detailItemAddressText(theme)}>
            {tx.to}
          </OMGText>
          <OMGText style={styles.detailItemValueText(theme)}>
            {formatTokenBalance(tx.value, tx.tokenDecimal)} {tx.tokenSymbol}
          </OMGText>
        </View>
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
    flex: 1,
    flexDirection: 'column',
    borderRadius: theme.roundness
  }),
  title: theme => ({
    color: theme.colors.gray3
  }),
  detailContainer: {
    marginTop: 8
  },
  detailItem: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailItemAddressText: theme => ({
    flex: 1,
    marginRight: 36,
    color: theme.colors.blue4,
    marginLeft: 6
  }),
  detailItemValueText: theme => ({
    color: theme.colors.black2
  }),
  divider: theme => ({
    opacity: 0.25,
    backgroundColor: theme.colors.black1,
    height: 1,
    marginTop: 16
  })
})

export default TransactionDetailFromTo
