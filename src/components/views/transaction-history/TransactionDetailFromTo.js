import React, { useCallback } from 'react'
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import { OMGIcon, OMGText } from 'components/widgets'
import { Formatter } from 'common/utils'
import Config from 'react-native-config'

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const TransactionDetailFromTo = ({ theme, tx, style }) => {
  const handleClickAddress = useCallback(address => {
    Linking.openURL(`${Config.ETHERSCAN_ADDRESS_URL}${address}`)
  }, [])

  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.detailContainer}>
        <OMGText style={styles.title(theme)}>From</OMGText>
        <View style={styles.detailItem}>
          <OMGIcon name='wallet' size={14} />
          <TouchableOpacity
            style={styles.detailItemAddress}
            onPress={() => handleClickAddress(tx.from)}>
            <OMGText
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.detailItemAddressText(theme)}>
              {tx.from}
            </OMGText>
          </TouchableOpacity>
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
          <TouchableOpacity
            style={styles.detailItemAddress}
            onPress={() => handleClickAddress(tx.to)}>
            <OMGText
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.detailItemAddressText(theme)}>
              {tx.to}
            </OMGText>
          </TouchableOpacity>
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
  detailItemAddress: {
    flex: 1,
    marginRight: 36,
    marginLeft: 6
  },
  detailItemAddressText: theme => ({
    color: theme.colors.blue4
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
