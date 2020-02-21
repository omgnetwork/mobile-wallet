import React, { useCallback } from 'react'
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import { OMGFontIcon, OMGText } from 'components/widgets'
import { BlockchainRenderer } from 'common/blockchain'
import Config from 'react-native-config'
import { TransactionTypes, BlockchainNetworkType } from 'common/constants'
import PlasmaContractIcon from './assets/ic-plasma-contract.svg'

const TransactionDetailFromTo = ({ theme, tx, style }) => {
  const handleAddressClick = useCallback(
    address => {
      if (tx.network === BlockchainNetworkType.TYPE_OMISEGO_NETWORK) {
        Linking.openURL(`${Config.BLOCK_EXPLORER_URL}address/${address}`)
      } else {
        Linking.openURL(`${Config.ETHERSCAN_ADDRESS_URL}${address}`)
      }
    },
    [tx.network]
  )

  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.detailContainer}>
        <OMGText style={styles.title(theme)}>From</OMGText>
        <View style={styles.detailItem}>
          <OMGFontIcon name='wallet' size={18} color={theme.colors.white} />
          <TouchableOpacity
            style={styles.detailItemAddress}
            onPress={() => handleAddressClick(tx.from)}>
            <OMGText
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.detailItemAddressText(theme)}>
              {tx.from || 'Unidentified'}
            </OMGText>
          </TouchableOpacity>
          <OMGText style={styles.detailItemValueText(theme)}>
            {BlockchainRenderer.renderTokenBalanceFromSmallestUnit(
              tx.value,
              tx.tokenDecimal
            )}{' '}
            {tx.tokenSymbol}
          </OMGText>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <OMGText style={styles.title(theme)}>To</OMGText>
        <View style={styles.detailItem}>
          {tx.type === TransactionTypes.TYPE_DEPOSIT ? (
            <PlasmaContractIcon width={18} height={18} />
          ) : (
            <OMGFontIcon name='wallet' size={18} color={theme.colors.white} />
          )}
          <TouchableOpacity
            style={styles.detailItemAddress}
            onPress={() => handleAddressClick(tx.to)}>
            <OMGText
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.detailItemAddressText(theme)}>
              {tx.to || 'Unidentified'}
            </OMGText>
          </TouchableOpacity>
          <OMGText style={styles.detailItemValueText(theme)}>
            {BlockchainRenderer.renderTokenBalanceFromSmallestUnit(
              tx.value,
              tx.tokenDecimal
            )}{' '}
            {tx.tokenSymbol}
          </OMGText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    borderRadius: theme.roundness
  }),
  title: theme => ({
    color: theme.colors.white,
    fontSize: 12,
    textTransform: 'uppercase',
    paddingVertical: 16
  }),
  detailContainer: {},
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  detailItemAddress: {
    flex: 1,
    marginRight: 36,
    marginLeft: 6
  },
  detailItemAddressText: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.white
  }),
  detailItemValueText: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.gray6
  })
})

export default TransactionDetailFromTo
