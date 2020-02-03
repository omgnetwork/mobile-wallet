import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGFontIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGExitWarning = ({ theme, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGFontIcon
        style={styles.icon}
        size={30}
        name='attention'
        color={theme.colors.new_blue1}
      />
      <OMGText style={styles.text(theme)}>
        You are about to move fund out of {'-\n'}
        <OMGText weight='mono-semi-bold'>Plasma </OMGText>
        Chain to
        <OMGText weight='mono-semi-bold'> Ethereum </OMGText>
        Chain
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    padding: 18,
    backgroundColor: theme.colors.new_gray3,
    alignItems: 'center'
  }),
  iconContainer: theme => ({
    width: 24,
    height: 24,
    marginLeft: 16,
    backgroundColor: theme.colors.yellow,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  text: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    color: theme.colors.white,
    marginLeft: 18
  }),
  icon: {}
})

export default withTheme(OMGExitWarning)
