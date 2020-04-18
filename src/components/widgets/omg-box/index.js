import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

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
    paddingHorizontal: 16,
    paddingVertical: Styles.getResponsiveSize(16, { small: 12, medium: 12 }),
    borderRadius: 4
  })
})

export default withTheme(OMGBox)
