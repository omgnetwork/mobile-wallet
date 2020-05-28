import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import { IconEth, IconGo } from './assets'
import { Styles } from 'common/utils'

const OMGAssetHeader = ({ theme, rootchain, network, anchoredRef, style }) => {
  const BlockchainIcon = rootchain ? IconEth : IconGo
  return (
    <View style={{ ...styles.container(theme), ...style }} ref={anchoredRef}>
      <View style={styles.footer}>
        <BlockchainIcon
          fill={theme.colors.gray2}
          width={
            rootchain
              ? Styles.getResponsiveSize(14, { small: 10, medium: 12 })
              : Styles.getResponsiveSize(58, { small: 40, medium: 46 })
          }
          height={
            rootchain
              ? Styles.getResponsiveSize(23, { small: 16, medium: 20 })
              : Styles.getResponsiveSize(18, { small: 13, medium: 14 })
          }
        />
        <OMGText style={styles.textChain(theme)}>
          {rootchain ? 'Ethereum' : ''}
        </OMGText>
        <View style={styles.greenDot(theme)} />
        <OMGText style={styles.textNetwork(theme)}>{network}</OMGText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.black3,
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness
  }),
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: Styles.getResponsiveSize(20, { small: 12, medium: 16 }),
    alignItems: 'center'
  },
  textChain: theme => ({
    flex: 1,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 10 }),
    marginLeft: 20,
    letterSpacing: -0.7,
    color: theme.colors.gray2
  }),
  textNetwork: theme => ({
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 10 }),
    marginLeft: 6,
    textTransform: 'capitalize',
    color: theme.colors.gray2
  }),
  greenDot: theme => ({
    width: 6,
    height: 6,
    backgroundColor: theme.colors.green,
    borderRadius: 3
  })
})

export default withTheme(OMGAssetHeader)
