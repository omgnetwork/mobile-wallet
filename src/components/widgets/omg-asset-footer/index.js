import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import { OMGBackground } from 'components/widgets'

const OMGAssetFooter = ({ theme, style }) => {
  return (
    <OMGBackground style={{ ...styles.container(theme), ...style }}>
      <TouchableOpacity style={styles.subfooter}>
        <Text style={styles.subfooterText(theme)}>DEPOSIT</Text>
      </TouchableOpacity>
      <View style={styles.divider(theme)} />
      <TouchableOpacity style={styles.subfooter}>
        <Text style={styles.subfooterText(theme)}>EXIT</Text>
      </TouchableOpacity>
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: theme.roundness,
    borderBottomRightRadius: theme.roundness
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
  subfooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 13
  },
  subfooterText: theme => ({
    fontSize: 14,
    color: theme.colors.darkText4,
    marginRight: 4
  }),
  divider: theme => ({
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.white,
    opacity: 0.1
  })
})

export default withTheme(OMGAssetFooter)
