import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import { TransferHelper } from 'components/views/transfer'
import { IconEth, IconGo } from './assets'
import { Styles } from 'common/utils'

const OMGBlockchainLabel = ({ theme, actionText, transferType, style }) => {
  const isEthereumRootchain =
    [
      TransferHelper.TYPE_TRANSFER_CHILDCHAIN,
      TransferHelper.TYPE_DEPOSIT
    ].indexOf(transferType) === -1
  const blockchainName = isEthereumRootchain
    ? 'Ethereum Network'
    : 'OMG Network'
  const BlockchainIcon = isEthereumRootchain ? IconEth : IconGo

  return (
    <View style={[styles.container(theme, isEthereumRootchain), style]}>
      <BlockchainIcon
        width={isEthereumRootchain ? 18 : 60}
        height={isEthereumRootchain ? 27 : 20}
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
    backgroundColor: isRootchain ? theme.colors.gray : theme.colors.primary,
    paddingVertical: Styles.getResponsiveSize(11, { small: 8, medium: 10 }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }),
  text: (theme, isEthereumRootchain) => ({
    marginLeft: 16,
    color: isEthereumRootchain ? theme.colors.black5 : theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 10 })
  })
})

export default withTheme(OMGBlockchainLabel)
