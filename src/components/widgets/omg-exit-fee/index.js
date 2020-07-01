import React, { useEffect, useState, useCallback } from 'react'
import { withTheme } from 'react-native-paper'
import { BlockchainFormatter } from 'common/blockchain'
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { OMGText, OMGEmpty, OMGEditItem } from 'components/widgets'
import { Formatter, BigNumber } from 'common/utils'

const OMGExitFee = ({
  theme,
  style,
  fee,
  feeToken,
  exitBond,
  error,
  onPressEdit
}) => {
  const [totalFeeUsd, setTotalFeeUsd] = useState()

  const formatTotalExitFee = useCallback(() => {
    if (fee && exitBond) {
      return BigNumber.plus(fee, exitBond)
    }
  }, [exitBond, fee])

  useEffect(() => {
    if (feeToken?.price && formatTotalExitFee()) {
      const feeUsd = BlockchainFormatter.formatTokenPrice(
        formatTotalExitFee(),
        feeToken.price
      )
      setTotalFeeUsd(feeUsd)
    }
  }, [feeToken, formatTotalExitFee])

  const handleClickHyperlink = useCallback(() => {
    Linking.openURL('https://docs.omg.network/exitbonds')
  }, [])

  return (
    <View style={[styles.background(theme), style]}>
      <View style={[styles.container]}>
        <OMGEditItem
          title='Total'
          error={error}
          rightFirstLine={`${formatTotalExitFee() || 0} ETH`}
          rightSecondLine={`${totalFeeUsd} USD`}
          loading={!fee || !exitBond}
          onPress={onPressEdit}
        />
      </View>
      <Divider theme={theme} />
      <View style={[styles.container]}>
        <Item
          title='Transaction Fee'
          loading={!fee}
          error={error}
          theme={theme}
          feeToken={feeToken}
          value={fee}
        />
        <Item
          title='Exit Bond'
          subtitle='You’ll receive your funds after successful withdrawal from the OMG Network.'
          loading={!exitBond}
          theme={theme}
          value={exitBond}
          feeToken={feeToken}
          itemStyle={styles.itemMargin}
        />
        <TouchableOpacity
          style={styles.hyperlinkButton}
          onPress={handleClickHyperlink}>
          <OMGText style={styles.hyperlinkText(theme)}>Learn more</OMGText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Item = ({
  title,
  subtitle,
  value,
  error,
  itemStyle,
  theme,
  feeToken,
  loading
}) => {
  const localizedValue = value && Formatter.format(value, { maxDecimal: 8 })
  const feeUsd =
    value && BlockchainFormatter.formatTokenPrice(value, feeToken.price)

  return (
    <View style={[styles.itemContainer, itemStyle]}>
      <View style={[styles.itemSubContainer]}>
        <OMGText
          style={[styles.textWhite(theme), styles.textSmall, styles.stretch]}>
          {title}
        </OMGText>
        {!loading ? (
          <OMGText
            style={[styles.textFirstLine(theme, error), styles.textSmall]}>
            {error ? 'Estimation Failed' : `${localizedValue} ETH`}
          </OMGText>
        ) : (
          <OMGEmpty
            loading={loading}
            style={[styles.alignRight, styles.marginSmall]}
          />
        )}
      </View>
      <View style={[styles.itemSubContainer, styles.alignRight]}>
        {!!subtitle && (
          <OMGText
            numberOfLines={3}
            style={[
              styles.textGray(theme),
              styles.textSmall,
              styles.marginSmall,
              styles.stretch,
              styles.marginRightSmall
            ]}>
            {subtitle}
          </OMGText>
        )}
        {!loading && (
          <OMGText
            style={[
              styles.textWhite(theme),
              styles.textSmall,
              styles.marginSmall,
              styles.alignTop
            ]}>
            {feeUsd} USD
          </OMGText>
        )}
      </View>
    </View>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  background: theme => ({
    backgroundColor: theme.colors.gray7,
    borderRadius: 8
  }),
  container: {
    flexDirection: 'column',
    paddingVertical: 16,
    paddingHorizontal: 12
  },
  itemContainer: {
    flexDirection: 'column'
  },
  itemSubContainer: {
    flexDirection: 'row'
  },
  alignRight: {
    marginLeft: 'auto',
    alignItems: 'flex-end'
  },
  alignTop: {
    alignSelf: 'flex-start'
  },
  textFirstLine: (theme, error) => ({
    color: error ? theme.colors.gray2 : theme.colors.white
  }),
  textWhite: theme => ({
    color: theme.colors.white
  }),
  textGray: theme => ({
    color: theme.colors.gray
  }),
  stretch: {
    flex: 1
  },
  textSmall: {
    fontSize: 12,
    letterSpacing: -0.48
  },
  itemMargin: {
    marginTop: 16
  },
  hyperlinkButton: {
    marginTop: 10
  },
  marginSmall: {
    marginTop: 2
  },
  marginRightSmall: {
    marginRight: 4
  },
  hyperlinkText: theme => ({
    color: theme.colors.blue,
    fontSize: 12,
    letterSpacing: -0.48
  }),
  divider: theme => ({
    backgroundColor: theme.colors.gray4,
    height: 1,
    marginHorizontal: 16
  })
})

export default withTheme(OMGExitFee)
