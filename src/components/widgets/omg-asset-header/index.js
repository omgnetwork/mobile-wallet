import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGText } from 'components/widgets'
import { IconEth, IconGo } from './assets'
import { Styles } from 'common/utils'

const OMGAssetHeader = ({
  theme,
  loading,
  amount,
  currency,
  rootchain,
  network,
  anchoredRef,
  style
}) => {
  const BlockchainIcon = rootchain ? IconEth : IconGo
  return (
    <View style={{ ...styles.container(theme), ...style }} ref={anchoredRef}>
      <View style={styles.balance}>
        {loading ? (
          <OMGEmpty style={styles.loading} loading={loading} />
        ) : (
          <OMGText style={styles.balanceAmount(theme)}>{amount}</OMGText>
        )}
        <OMGText style={styles.balanceCurrency(theme)} weight='light'>
          {currency}
        </OMGText>
      </View>
      <View style={styles.footer}>
        <BlockchainIcon
          fill={theme.colors.gray2}
          width={rootchain ? 14 : 57.963}
          height={rootchain ? 23 : 18}
        />
        <OMGText style={styles.textChain(theme)}>
          {rootchain ? 'Ethereum Rootchain' : 'Plasma Childchain'}
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
  balance: {
    flexDirection: 'row',
    padding: 20
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 0,
    alignItems: 'flex-start'
  },
  balanceAmount: theme => ({
    flex: 1,
    textAlign: 'left',
    fontSize: Styles.getResponsiveSize(32, { small: 18, medium: 24 }),
    letterSpacing: -3,
    color: theme.colors.white
  }),
  balanceCurrency: theme => ({
    color: theme.colors.white3,
    fontSize: Styles.getResponsiveSize(32, { small: 18, medium: 24 })
  }),
  footer: {
    flexDirection: 'row',
    marginHorizontal: 20,
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
