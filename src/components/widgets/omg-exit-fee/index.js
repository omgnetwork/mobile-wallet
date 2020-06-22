import React, { useEffect, useState, useCallback } from 'react'
import { withTheme } from 'react-native-paper'
import { BlockchainFormatter, Token } from 'common/blockchain'
import { ContractAddress } from 'common/constants'
import Config from 'react-native-config'
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { OMGText, OMGEmpty, OMGEditItem } from 'components/widgets'
import { Formatter } from 'common/utils'

const OMGExitFee = ({
  theme,
  gasUsed,
  exitBondValue,
  gasPrice,
  style,
  onPressEdit
}) => {
  const [ethPrice, setEthPrice] = useState()
  const [feeUsd, setFeeUsd] = useState()

  const formatBond = useCallback(() => {
    if (exitBondValue)
      return BlockchainFormatter.formatUnits(exitBondValue, 'ether')
    else return 0
  }, [exitBondValue])

  const formatGasFee = useCallback(() => {
    return BlockchainFormatter.formatGasFee(gasUsed, gasPrice)
  }, [gasUsed, gasPrice])

  const formatTotalExitFee = useCallback(() => {
    if (gasUsed && exitBondValue) {
      const gasFee = BlockchainFormatter.formatGasFee(
        gasUsed,
        gasPrice,
        exitBondValue
      )
      return Formatter.format(gasFee, { maxDecimal: 18 })
    }
  }, [exitBondValue, gasUsed, gasPrice])

  useEffect(() => {
    async function fetchEthPrice() {
      const price = await Token.getPrice(
        ContractAddress.ETH_ADDRESS,
        Config.ETHEREUM_NETWORK
      )
      setEthPrice(price)
    }
    fetchEthPrice()
  }, [])

  useEffect(() => {
    if (ethPrice && formatTotalExitFee()) {
      const price = BlockchainFormatter.formatTokenPrice(
        formatTotalExitFee(),
        ethPrice
      )
      setFeeUsd(price)
    }
  }, [ethPrice, formatTotalExitFee])

  const handleClickHyperlink = useCallback(() => {
    Linking.openURL('https://docs.omg.network/exitbonds')
  }, [])

  return (
    <View style={[styles.background(theme), style]}>
      <View style={[styles.container]}>
        <OMGEditItem
          title='Total'
          rightFirstLine={`${formatTotalExitFee() || 0} ETH`}
          rightSecondLine={`${feeUsd} USD`}
          loading={!gasUsed || !exitBondValue}
          onPress={onPressEdit}
        />
      </View>
      <Divider theme={theme} />
      <View style={[styles.container]}>
        <Item
          title='Transaction Fee'
          loading={!gasUsed}
          theme={theme}
          ethPrice={ethPrice}
          value={formatGasFee(gasUsed)}
        />
        <Item
          title='Exit Bond'
          subtitle='You’ll receive your funds after successful withdrawal from the OMG Network.'
          loading={!exitBondValue}
          theme={theme}
          ethPrice={ethPrice}
          value={formatBond()}
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
  itemStyle,
  theme,
  ethPrice,
  loading
}) => {
  const localizedValue = Formatter.format(value, { maxDecimal: 8 })
  const feeUsd = BlockchainFormatter.formatTokenPrice(value, ethPrice)

  return (
    <View style={[styles.itemContainer, itemStyle]}>
      <View style={[styles.itemSubContainer]}>
        <OMGText
          style={[styles.textWhite(theme), styles.textSmall, styles.stretch]}>
          {title}
        </OMGText>
        {!loading ? (
          <OMGText style={[styles.textWhite(theme), styles.textSmall]}>
            {localizedValue} ETH
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
        {!loading ? (
          <OMGText
            style={[
              styles.textWhite(theme),
              styles.textSmall,
              styles.marginSmall,
              styles.alignTop
            ]}>
            {feeUsd} USD
          </OMGText>
        ) : (
          <OMGEmpty
            loading={loading}
            style={[styles.alignRight, styles.marginSmall]}
          />
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
    backgroundColor: theme.colors.gray7
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
