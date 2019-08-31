import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGBox = ({ children, theme, onPress, style, elevation }) => {
  const { colors } = theme
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      elevation={elevation}
      activeOpacity={0.6}
      style={{
        ...styles.container(colors.white),
        ...style
      }}>
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: backgroundColor => ({
    backgroundColor: backgroundColor,
    padding: 16,
    borderRadius: 4
  })
})

export default withTheme(OMGBox)
