import React, { useCallback } from 'react'
import { View, StyleSheet, Linking, TouchableOpacity } from 'react-native'
import { OMGFontIcon, OMGText } from 'components/widgets'
import { BlockchainFormatter, Transaction } from 'common/blockchain'
import Config from 'react-native-config'
import { TransactionTypes, BlockchainNetworkType } from 'common/constants'
import PlasmaContractIcon from './assets/ic-plasma-contract.svg'

const TransactionDetailFromTo = ({ theme, tx, style }) => {
  const { network, from, to, value, tokenSymbol, tokenDecimal, type } = tx
  const handleAddressClick = useCallback(
    address => {
      if (network === BlockchainNetworkType.TYPE_OMISEGO_NETWORK) {
        Linking.openURL(`${Config.BLOCK_EXPLORER_URL}address/${address}`)
      } else {
        Linking.openURL(`${Config.ETHERSCAN_URL}address/${address}`)
      }
    },
    [network]
  )

  const renderAddressIcon = useCallback(
    (address, txType) => {
      const isDeposit = txType === TransactionTypes.TYPE_DEPOSIT
      const isExitTransfer = Transaction.isExitTransferTx({ from: address })
      if (isDeposit || isExitTransfer) {
        return <PlasmaContractIcon width={18} height={18} />
      } else {
        return (
          <OMGFontIcon name='wallet' size={18} color={theme.colors.white} />
        )
      }
    },
    [theme.colors.white]
  )

  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.detailContainer}>
        <OMGText style={styles.title(theme)}>From</OMGText>
        <View style={styles.detailItem}>
          {renderAddressIcon(from, null)}
          <TouchableOpacity
            style={styles.detailItemAddress}
            onPress={() => handleAddressClick(from)}>
            <OMGText
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.detailItemAddressText(theme)}>
              {from || 'Unidentified'}
            </OMGText>
          </TouchableOpacity>
          <OMGText style={styles.detailItemValueText(theme)}>
            {BlockchainFormatter.formatTokenBalanceFromSmallestUnit(
              value,
              tokenDecimal
            )}{' '}
            {tokenSymbol}
          </OMGText>
        </View>
      </View>
      <View style={styles.detailContainer}>
        <OMGText style={[styles.title(theme), styles.marginTopMedium]}>
          To
        </OMGText>
        <View style={styles.detailItem}>
          {renderAddressIcon(null, type)}
          <TouchableOpacity
            style={styles.detailItemAddress}
            onPress={() => handleAddressClick(to)}>
            <OMGText
              numberOfLines={1}
              ellipsizeMode='tail'
              style={styles.detailItemAddressText(theme)}>
              {to || 'Unidentified'}
            </OMGText>
          </TouchableOpacity>
          <OMGText style={styles.detailItemValueText(theme)}>
            {BlockchainFormatter.formatTokenBalanceFromSmallestUnit(
              value,
              tokenDecimal
            )}{' '}
            {tokenSymbol}
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
    marginBottom: 16
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
  }),
  marginTopMedium: {
    marginTop: 16
  }
})

export default TransactionDetailFromTo
