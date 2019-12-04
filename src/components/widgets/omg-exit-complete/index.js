import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGExitComplete = ({
  theme,
  style,
  processedAt = 'Apr 05, 12:02 PM'
}) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGIcon name='time' size={24} style={styles.icon(theme)} />
      <OMGText style={styles.text(theme)}>
        Exit will be approximately completed on
        <OMGText weight='bold'> {processedAt}. </OMGText>
        You can track the transaction status in the
        <OMGText weight='bold'> History </OMGText>
        menu.
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    padding: 16,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.yellow4
  }),
  icon: theme => ({
    color: theme.colors.black
  }),
  text: theme => ({
    color: theme.colors.primary,
    marginLeft: 16,
    marginRight: 16
  })
})

export default withTheme(OMGExitComplete)
