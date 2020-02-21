import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import { TransferHelper } from 'components/views/transfer'
import { IconEth, IconGo } from './assets'

const OMGBlockchainLabel = ({ theme, actionText, transferType, style }) => {
  const isEthereumRootchain =
    [
      TransferHelper.TYPE_TRANSFER_CHILDCHAIN,
      TransferHelper.TYPE_DEPOSIT
    ].indexOf(transferType) === -1
  const blockchainName = isEthereumRootchain
    ? 'Ethereum Rootchain'
    : 'Plasma Childchain'
  const BlockchainIcon = isEthereumRootchain ? IconEth : IconGo

  return (
    <View style={[styles.container(theme, isEthereumRootchain), style]}>
      <BlockchainIcon
        width={isEthereumRootchain ? 14 : 52.17}
        height={isEthereumRootchain ? 23 : 18}
        fill={isEthereumRootchain ? theme.colors.black5 : theme.colors.white}
      />
      <OMGText style={styles.text(theme, isEthereumRootchain)}>
        {actionText} {blockchainName}
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: (theme, isRootchain) => ({
    backgroundColor: isRootchain ? theme.colors.green2 : theme.colors.primary,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  text: (theme, isEthereumRootchain) => ({
    marginLeft: 16,
    color: isEthereumRootchain ? theme.colors.black5 : theme.colors.white,
    fontSize: 12
  })
})

export default withTheme(OMGBlockchainLabel)
