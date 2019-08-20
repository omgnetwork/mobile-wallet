import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import { OMGBackground, OMGEmpty, OMGText } from 'components/widgets'

const OMGAssetHeader = ({
  theme,
  loading,
  amount,
  currency,
  blockchain,
  network,
  rootChain,
  style
}) => {
  return (
    <OMGBackground style={{ ...styles.container(theme), ...style }}>
      <View style={styles.balance}>
        {loading ? (
          <OMGEmpty style={styles.loading} loading={loading} />
        ) : (
          <OMGText style={styles.balanceAmount(theme)}>{amount}</OMGText>
        )}
        <OMGText style={styles.balanceCurrency(theme)}>{currency}</OMGText>
      </View>
      <View style={styles.footer(theme)}>
        <View style={styles.subfooter}>
          <OMGText style={styles.subfooterText1(theme)}>{blockchain}</OMGText>
          <OMGText style={styles.subfooterText2(theme)}>
            {rootChain ? 'Rootchain' : 'Childchain'}
          </OMGText>
        </View>
        <View style={styles.divider(theme)} />
        <View style={styles.subfooter}>
          <OMGText style={styles.subfooterText1(theme)}>{network}</OMGText>
          <OMGText style={styles.subfooterText2(theme)}>Network</OMGText>
        </View>
      </View>
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.white
  }),
  balanceCurrency: theme => ({
    color: theme.colors.primaryLight,
    fontSize: 32
  }),
  footer: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryDarker
  }),
  subfooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8
  },
  subfooterText1: theme => ({
    fontSize: 12,
    textTransform: 'capitalize',
    color: theme.colors.black1,
    marginRight: 4
  }),
  subfooterText2: theme => ({
    fontSize: 12,
    textTransform: 'capitalize',
    color: theme.colors.black2
  }),
  divider: theme => ({
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.white,
    opacity: 0.1
  })
})

export default withTheme(OMGAssetHeader)