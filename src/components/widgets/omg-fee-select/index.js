import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import OMGText from '../omg-text'
import OMGFontIcon from '../omg-font-icon'
import { withTheme } from 'react-native-paper'
import { Formatter, Styles } from 'common/utils'

const OMGFeeSelect = ({ style, onPress, fee, theme }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
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
        <OMGFontIcon
          name='chevron-right'
          size={14}
          color={theme.colors.white}
        />
      </View>
    </TouchableOpacity>
  )
}

const formatFeePrice = (amount, price) => {
  const parsedAmount = parseFloat(amount)
  const tokenPrice = parsedAmount * price
  return Formatter.format(tokenPrice, {
    maxDecimal: 2
  })
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: theme.roundness
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
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
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
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
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
