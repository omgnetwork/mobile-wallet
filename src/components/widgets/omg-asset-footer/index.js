import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'

const OMGAssetFooter = ({
  theme,
  style,
  onPressDeposit,
  onPressExit,
  enableDeposit,
  enableExit,
  depositText = 'DEPOSIT',
  footerRef,
  showExit
}) => {
  return (
    <View style={{ ...styles.container(theme), ...style }} ref={footerRef}>
      <TouchableOpacity style={styles.subfooter} onPress={onPressDeposit}>
        <OMGText style={styles.subfooterText(theme, enableDeposit)}>
          {depositText}
        </OMGText>
      </TouchableOpacity>
      {showExit && (
        <>
          <View style={styles.divider(theme)} />
          <TouchableOpacity style={styles.subfooter} onPress={onPressExit}>
            <OMGText style={styles.subfooterText(theme, enableExit)}>
              EXIT
            </OMGText>
          </TouchableOpacity>
        </>
      )}
    </View>
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
  subfooterText: (theme, enabled) => ({
    fontSize: 14,
    color: theme.colors.black4,
    opacity: enabled ? 1.0 : 0.4,
    marginRight: 4
  }),
  divider: theme => ({
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.white,
    opacity: 0.1
  })
})

export default withTheme(OMGAssetFooter)
