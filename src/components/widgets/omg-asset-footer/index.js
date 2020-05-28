import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import { Styles } from 'common/utils'

const OMGAssetFooter = ({
  theme,
  style,
  onPressDeposit,
  onPressExit,
  enableDeposit,
  enableExit,
  footerRef,
  showExit = true
}) => {
  return (
    <View style={{ ...styles.container(theme), ...style }} ref={footerRef}>
      <TouchableOpacity style={styles.subfooter} onPress={onPressDeposit}>
        <OMGText style={styles.subfooterText(theme, enableDeposit)}>
          DEPOSIT
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
  subfooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Styles.getResponsiveSize(13, { small: 10, medium: 12 })
  },
  subfooterText: (theme, enabled) => ({
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    color: theme.colors.white,
    opacity: enabled ? 1.0 : 0.4,
    marginRight: 4
  }),
  divider: theme => ({
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.black3,
    opacity: 0.1
  })
})

export default withTheme(OMGAssetFooter)
