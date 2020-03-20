import React, { useEffect, useState, useCallback } from 'react'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { BlockchainDataFormatter, Token } from 'common/blockchain'
import { ContractAddress } from 'common/constants'
import Config from 'react-native-config'
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { OMGText, OMGEmpty } from 'components/widgets'

const OMGExitFee = ({ theme, feeValue, exitBondValue, gasOptions, style }) => {
  const [ethPrice, setEthPrice] = useState()
  const gasPrice = gasOptions[3].amount

  const formatBond = useCallback(() => {
    return BlockchainDataFormatter.formatEthFromWei(exitBondValue)
  }, [exitBondValue])

  const formatGasFee = useCallback(() => {
    return BlockchainDataFormatter.formatGasFee(feeValue, gasPrice)
  }, [feeValue, gasPrice])

  const formatTotalExitFee = useCallback(() => {
    if (feeValue && exitBondValue) {
      return BlockchainDataFormatter.formatGasFee(
        feeValue,
        gasPrice,
        exitBondValue
      )
    }
  }, [exitBondValue, feeValue, gasPrice])

  useEffect(() => {
    async function fetchEthPrice() {
      const price = await Token.fetchPrice(
        ContractAddress.ETH_ADDRESS,
        Config.ETHERSCAN_NETWORK
      )
      setEthPrice(price)
    }
    fetchEthPrice()
  }, [])

  const handleClickHyperlink = useCallback(() => {
    Linking.openURL('https://docs.omg.network/exitbonds')
  }, [])

  const Item = ({
    title,
    subtitle,
    value,
    itemStyle,
    textColor = theme.colors.gray
  }) => {
    const feeUsd = BlockchainDataFormatter.formatTokenPrice(value, ethPrice)

    return (
      <View style={[styles.itemContainer, itemStyle]}>
        <View style={[styles.itemSubContainer, styles.stretch]}>
          <OMGText style={[styles.textPrimary(textColor), styles.textBig]}>
            {title}
          </OMGText>
          {!!subtitle && (
            <OMGText
              style={[
                styles.textPrimary(theme.colors.gray),
                styles.textSmall,
                styles.textMargin,
                styles.stretch
              ]}>
              {subtitle}
            </OMGText>
          )}
        </View>
        <View style={[styles.itemSubContainer, styles.alignRight]}>
          {value.toString() * 1 ? (
            <>
              <OMGText style={[styles.textPrimary(textColor), styles.textBig]}>
                {value} ETH
              </OMGText>
              <OMGText
                style={[
                  styles.textPrimary(textColor),
                  styles.textSmall,
                  styles.textMargin
                ]}>
                {feeUsd} USD
              </OMGText>
            </>
          ) : (
            <OMGEmpty loading={true} />
          )}
        </View>
      </View>
    )
  }

  return (
    <>
      <View style={[styles.container(theme), style]}>
        <Item title='Transaction Fee' value={formatGasFee(feeValue)} />
        <Item
          title='Exit Bond'
          subtitle='You’ll get this back after successfully exited'
          value={formatBond()}
          itemStyle={styles.itemMargin}
        />
        <TouchableOpacity
          style={styles.hyperlinkButton}
          onPress={handleClickHyperlink}>
          <OMGText style={styles.hyperlinkText(theme)}>Learn more</OMGText>
        </TouchableOpacity>
      </View>
      <View style={[styles.container(theme), styles.gapMargin]}>
        <Item
          title='Total Exit Fee'
          textColor={theme.colors.white}
          value={formatTotalExitFee() || 0}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.gray5,
    padding: 12
  }),
  itemContainer: {
    flexDirection: 'row',
    flex: 1
  },
  itemSubContainer: {
    flexDirection: 'column'
  },
  alignRight: {
    marginLeft: 'auto',
    alignItems: 'flex-end'
  },
  textPrimary: color => ({
    color: color
  }),
  stretch: {
    flex: 1
  },
  textBig: {
    fontSize: 16,
    letterSpacing: -0.64
  },
  textSmall: {
    fontSize: 12,
    letterSpacing: -0.48
  },
  textMargin: {
    marginTop: 2
  },
  gapMargin: {
    marginTop: 2
  },
  itemMargin: {
    marginTop: 16
  },
  hyperlinkButton: {
    marginTop: 10
  },
  hyperlinkText: theme => ({
    color: theme.colors.blue,
    fontSize: 12,
    letterSpacing: -0.48
  })
})

const mapStateToProps = (state, ownProps) => ({
  gasOptions: state.gasOptions
})

export default connect(
  mapStateToProps,
  null
)(withTheme(OMGExitFee))
