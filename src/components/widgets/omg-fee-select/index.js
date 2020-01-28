import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import OMGText from '../omg-text'
import OMGFontIcon from '../omg-font-icon'
import { withTheme } from 'react-native-paper'
import { Formatter } from 'common/utils'

const OMGFeeSelect = ({ style, onPress, fee, selected, theme }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme, selected), ...style }}
      onPress={onPress}>
      <View style={styles.sectionFeeSpeed}>
        <OMGText style={styles.feeSpeed(theme)} weight='mono-bold'>
          {fee.speed}
        </OMGText>
        <OMGText style={styles.feeEstimateTime(theme)}>
          {fee.estimateTime}
        </OMGText>
      </View>
      <View style={styles.sectionFeeAmount}>
        <OMGText
          style={styles.feeAmount(theme)}
          ellipsizeMode='tail'
          weight='mono-bold'
          numberOfLines={1}>
          {fee.amount} {fee.symbol}
        </OMGText>
        <OMGText style={styles.feePrice(theme)}>
          ${formatFeePrice(fee.amount, fee.price)}/transfer
        </OMGText>
      </View>
      <View style={styles.sectionSelect}>
        {selected && (
          <OMGFontIcon name='check-mark' size={14} color={theme.colors.gray3} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const formatFeePrice = (amount, price) => {
  const parsedAmount = parseFloat(amount)
  const tokenPrice = parsedAmount * price
  return Formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const styles = StyleSheet.create({
  container: (theme, selected) => ({
    flexDirection: 'row',
    backgroundColor: selected ? theme.colors.blue1 : theme.colors.gray4,
    alignItems: 'center',
    padding: 20,
    borderRadius: theme.roundness,
    borderColor: selected ? theme.colors.blue1 : theme.colors.black4,
    borderWidth: 1
  }),
  sectionFeeSpeed: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 16
  },
  sectionFeeAmount: {
    flexDirection: 'column'
  },
  feeSpeed: theme => ({
    textTransform: 'uppercase',
    color: theme.colors.primary
  }),
  feeEstimateTime: theme => ({
    color: theme.colors.black2,
    fontSize: 12
  }),
  feeAmount: theme => ({
    textAlign: 'right',
    fontSize: 14,
    textTransform: 'uppercase',
    color: theme.colors.black2
  }),
  feePrice: theme => ({
    textAlign: 'right',
    color: theme.colors.black2,
    fontSize: 8
  }),
  sectionSelect: {
    width: 14,
    marginLeft: 20
  }
})

export default withTheme(OMGFeeSelect)
