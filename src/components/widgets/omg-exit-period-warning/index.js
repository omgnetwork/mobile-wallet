import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGFontIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

const OMGExitPeriodWarning = ({ theme, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.header}>
        <OMGFontIcon
          size={Styles.getResponsiveSize(30, { small: 24, medium: 30 })}
          name='attention'
          color={theme.colors.white}
        />
        <OMGText
          style={[styles.headerText, styles.text(theme)]}
          weight='regular'>
          A withdrawal will take two weeks to process.
        </OMGText>
      </View>
      <View style={styles.message}>
        <OMGText style={[styles.messageText, styles.text(theme)]}>
          The withdrawal period is key to the security architecture of the OMG
          Network.
        </OMGText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 8
  }),
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  message: {
    marginTop: Styles.getResponsiveSize(25, { small: 20, medium: 22.5 })
  },

  headerText: {
    fontSize: Styles.getResponsiveSize(20, { small: 16, medium: 20 }),
    marginLeft: 16
  },
  messageText: {
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 14 })
  },
  text: theme => ({
    letterSpacing: -0.48,
    color: theme.colors.white
  })
})

export default withTheme(OMGExitPeriodWarning)
