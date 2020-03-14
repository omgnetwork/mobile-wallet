import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGFontIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { BlockchainDataFormatter } from 'common/blockchain'

const OMGExitComplete = ({ theme, style, exitableAt }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGFontIcon name='time' size={30} style={styles.icon(theme)} />
      <OMGText style={styles.text(theme)}>
        Exit will be approximately completed on
        <OMGText weight='mono-semi-bold'>
          {BlockchainDataFormatter.formatProcessExitAt(exitableAt)}
        </OMGText>
        You can track the exit status in the
        <OMGText weight='mono-semi-bold'> History </OMGText>
        menu.
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.gray5
  }),
  icon: theme => ({
    color: theme.colors.blue
  }),
  text: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    lineHeight: 18,
    color: theme.colors.white,
    marginLeft: 16,
    marginRight: 24
  })
})

export default withTheme(OMGExitComplete)
