import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'

const OMGTextChip = ({ theme, text, style, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <OMGText style={styles.text(theme)}>{text}</OMGText>
    </TouchableOpacity>
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
