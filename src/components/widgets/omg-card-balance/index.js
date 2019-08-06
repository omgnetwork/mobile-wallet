import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import { OMGBackground } from 'components/widgets'

const OMGCardBalance = ({
  theme,
  amount,
  currency,
  blockchain,
  network,
  style
}) => {
  return (
    <OMGBackground style={{ ...styles.container(theme), ...style }}>
      <View style={styles.balance}>
        <Text style={styles.balanceAmount(theme)}>{amount}</Text>
        <Text style={styles.balanceCurrency(theme)}>{currency}</Text>
      </View>
      <View style={styles.footer(theme)}>
        <View style={styles.subfooter}>
          <Text style={styles.subfooterText1(theme)}>{blockchain}</Text>
          <Text style={styles.subfooterText2(theme)}>Blockchain</Text>
        </View>
        <View style={styles.divider(theme)} />
        <View style={styles.subfooter}>
          <Text style={styles.subfooterText1(theme)}>{network}</Text>
          <Text style={styles.subfooterText2(theme)}>Network</Text>
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
    color: theme.colors.darkText1,
    marginRight: 4
  }),
  subfooterText2: theme => ({
    fontSize: 12,
    color: theme.colors.darkText2
  }),
  divider: theme => ({
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.white,
    opacity: 0.1
  })
})

export default withTheme(OMGCardBalance)
