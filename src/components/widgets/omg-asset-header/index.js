import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGText } from 'components/widgets'
import { IconEth, IconGo } from './assets'

const OMGAssetHeader = ({
  theme,
  loading,
  amount,
  currency,
  rootchain,
  anchoredRef,
  style
}) => {
  const BlockchainIcon = rootchain ? IconEth : IconGo
  return (
    <View style={{ ...styles.container(theme), ...style }}>
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
      <View style={styles.footer} ref={anchoredRef}>
        <BlockchainIcon
          fill={theme.colors.new_gray2}
          width={rootchain ? 14 : 57.963}
          height={rootchain ? 23 : 20}
        />
        <OMGText style={styles.textChain(theme)}>
          {rootchain ? 'Ethereum Rootchain' : 'Plasma Childchain'}
        </OMGText>
        <View style={styles.greenDot(theme)} />
        <OMGText style={styles.textNetwork(theme)}>Mainnet</OMGText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7,
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
    fontSize: 32,
    letterSpacing: -3,
    color: theme.colors.white
  }),
  balanceCurrency: theme => ({
    color: theme.colors.black1,
    fontSize: 32
  }),
  footer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    alignItems: 'center'
  },
  textChain: theme => ({
    flex: 1,
    fontSize: 12,
    marginLeft: 20,
    letterSpacing: -0.7,
    color: theme.colors.new_gray2
  }),
  textNetwork: theme => ({
    fontSize: 12,
    marginLeft: 6,
    color: theme.colors.new_gray2
  }),
  greenDot: theme => ({
    width: 6,
    height: 6,
    backgroundColor: theme.colors.new_green1,
    borderRadius: 3
  })
})

export default withTheme(OMGAssetHeader)
