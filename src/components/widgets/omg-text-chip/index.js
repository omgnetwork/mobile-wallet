import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'

const OMGTextChip = ({ theme, text, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGText style={styles.text(theme)}>{text}</OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.blue3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    borderRadius: theme.roundness
  }),
  text: theme => ({
    color: theme.colors.primary,
    textTransform: 'capitalize'
  })
})

export default withTheme(OMGTextChip)
