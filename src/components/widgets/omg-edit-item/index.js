import React from 'react'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { BlockchainFormatter } from 'common/blockchain'
import { OMGText, OMGFontIcon, OMGEmpty } from 'components/widgets'

const OMGEditItem = ({
  title,
  theme,
  value,
  symbol = 'ETH',
  price,
  style,
  loading,
  onPress
}) => {
  const feeUsd = BlockchainFormatter.formatTokenPrice(value, price)

  return (
    <View style={[styles.container(theme), style]}>
      <View style={[styles.column, styles.stretch]}>
        <OMGText style={[styles.textWhite(theme), styles.textBig]}>
          {title}
        </OMGText>
        <TouchableOpacity
          style={[styles.row, styles.textMargin]}
          onPress={onPress}>
          <OMGText
            style={[
              styles.textBlue(theme),
              styles.textSmall,
              styles.smallMarginRight
            ]}>
            Edit
          </OMGText>
          <OMGFontIcon name='edit' size={10} color={theme.colors.blue2} />
        </TouchableOpacity>
      </View>
      <View style={[styles.column, styles.alignRight]}>
        {loading ? (
          <OMGEmpty loading={loading} />
        ) : (
          <>
            <OMGText style={[styles.textWhite(theme), styles.textBig]}>
              {value} {symbol}
            </OMGText>
            <OMGText
              style={[
                styles.textGray(theme),
                styles.textSmall,
                styles.textMargin
              ]}>
              {feeUsd} USD
            </OMGText>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    flex: 1,
    backgroundColor: theme.colors.gray7
  }),
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stretch: {
    flex: 1
  },
  textWhite: theme => ({
    color: theme.colors.white
  }),
  textBlue: theme => ({
    color: theme.colors.blue2
  }),
  textGray: theme => ({
    color: theme.colors.gray6
  }),
  textSmall: {
    fontSize: 12,
    letterSpacing: -0.48
  },
  textBig: {
    fontSize: 16,
    letterSpacing: -0.64
  },
  alignRight: {
    marginLeft: 'auto',
    alignItems: 'flex-end'
  },
  textMargin: {
    marginTop: 6
  },
  smallMarginRight: {
    marginRight: 4
  }
})

export default withTheme(OMGEditItem)
