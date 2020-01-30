import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import { TransferHelper } from 'components/views/transfer'
import { IconEth, IconGo } from './assets'

const OMGBlockchainLabel = ({ theme, actionText, transferType, style }) => {
  const isEthereumRootchain =
    transferType !== TransferHelper.TYPE_TRANSFER_CHILDCHAIN
  const blockchainName = isEthereumRootchain
    ? 'Ethereum Rootchain'
    : 'Plasma Childchain'
  const BlockchainIcon = isEthereumRootchain ? IconEth : IconGo

  return (
    <View style={[styles.container(theme, isEthereumRootchain), style]}>
      <BlockchainIcon
        width={isEthereumRootchain ? 14 : 52.17}
        height={isEthereumRootchain ? 23 : 18}
        fill={isEthereumRootchain ? theme.colors.gray4 : theme.colors.white}
      />
      <OMGText style={styles.text(theme, isEthereumRootchain)}>
        {actionText} {blockchainName}
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: (theme, isRootchain) => ({
    backgroundColor: isRootchain
      ? theme.colors.new_green2
      : theme.colors.primary,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  icon: theme => ({
    color: theme.colors.gray4
  }),
  text: (theme, isEthereumRootchain) => ({
    marginLeft: 16,
    color: isEthereumRootchain ? theme.colors.gray4 : theme.colors.white,
    fontSize: 12
  })
})

export default withTheme(OMGBlockchainLabel)
