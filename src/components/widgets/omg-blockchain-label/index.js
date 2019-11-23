import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import { IconEth, IconGo } from './assets'

const OMGBlockchainLabel = ({ theme, actionText, isRootchain, style }) => {
  const blockchainName = isRootchain
    ? 'Ethereum Rootchain'
    : 'Plasma Childchain'
  const BlockchainIcon = isRootchain ? IconEth : IconGo

  return (
    <View style={[styles.container(theme, isRootchain), style]}>
      <BlockchainIcon
        width={isRootchain ? 14 : 20}
        height={isRootchain ? 23 : 19}
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
