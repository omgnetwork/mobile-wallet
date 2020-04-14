import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGFontIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGExitWarning = ({ theme, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGFontIcon size={30} name='attention' color={theme.colors.white} />
      <OMGText style={styles.text(theme)}>
        You are sending your funds back to the Ethereum Network
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'row',
    padding: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center'
  }),
  text: theme => ({
    flex: 1,
    fontSize: 12,
    letterSpacing: -0.48,
    color: theme.colors.white,
    marginLeft: 18,
    marginRight: 18
  })
})

export default withTheme(OMGExitWarning)
