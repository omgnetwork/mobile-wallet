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
        width={isEthereumRootchain ? 14 : 20}
        height={isEthereumRootchain ? 23 : 19}
        style={styles.icon(theme)}
      />
      <OMGText style={styles.text(theme)}>
        {actionText} {blockchainName}
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: (theme, isRootchain) => ({
    backgroundColor: isRootchain ? theme.colors.purple : theme.colors.blue2,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  icon: theme => ({
    color: theme.colors.white
  }),
  text: theme => ({
    marginLeft: 8,
    color: theme.colors.white,
    fontSize: 12
  })
})

export default withTheme(OMGBlockchainLabel)
