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
        <OMGText style={styles.feeSpeed(theme)}>{fee.speed}</OMGText>
        <OMGText style={styles.feeEstimateTime(theme)}>
          {fee.estimateTime}
        </OMGText>
      </View>
      <View style={styles.sectionFeeAmount}>
        <OMGText
          style={styles.feeAmount(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {fee.displayAmount} {fee.symbol}
        </OMGText>
        <OMGText style={styles.feePrice(theme)}>
          ${formatFeePrice(fee.displayAmount, fee.price)}/transfer
        </OMGText>
      </View>
      <View style={styles.sectionSelect}>
        {selected && (
          <OMGFontIcon name='check-mark' size={14} color={theme.colors.white} />
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
    backgroundColor: theme.colors.black3,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: theme.roundness,
    borderColor: selected ? theme.colors.blue : theme.colors.white,
    borderWidth: 1
  }),
  sectionFeeSpeed: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  sectionFeeAmount: {
    marginLeft: 'auto',
    flexDirection: 'column'
  },
  feeSpeed: theme => ({
    fontSize: 16,
    color: theme.colors.white,
    letterSpacing: -0.64
  }),
  feeEstimateTime: theme => ({
    color: theme.colors.gray,
    fontSize: 12,
    marginTop: 4,
    letterSpacing: -0.48
  }),
  feeAmount: theme => ({
    textAlign: 'right',
    fontSize: 16,
    color: theme.colors.white,
    letterSpacing: -0.48
  }),
  feePrice: theme => ({
    textAlign: 'right',
    color: theme.colors.gray,
    fontSize: 12,
    marginTop: 4,
    letterSpacing: -0.48
  }),
  sectionSelect: {
    width: 14,
    marginLeft: 12
  }
})

export default withTheme(OMGFeeSelect)
