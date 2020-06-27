import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGFontIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

const OMGExitWarning = ({ theme, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGFontIcon
        size={Styles.getResponsiveSize(36, { small: 24, medium: 30 })}
        name='attention'
        color={theme.colors.white}
      />
      <OMGText style={styles.text(theme)}>
        You are sending your funds back to Ethereum
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    borderRadius: 8
  }),
  text: theme => ({
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    letterSpacing: -0.48,
    lineHeight: 20,
    color: theme.colors.white,
    marginLeft: Styles.getResponsiveSize(18, { small: 8, medium: 12 }),
    marginRight: Styles.getResponsiveSize(18, { small: 8, medium: 12 })
  })
})

export default withTheme(OMGExitWarning)
