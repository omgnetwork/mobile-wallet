import React from 'react'
import { StyleSheet } from 'react-native'
import { Surface, withTheme } from 'react-native-paper'

const OMGBox = ({ children, theme, style }) => {
  const { colors } = theme
  return (
    <Surface
      style={{
        ...styles.container(colors.input),
        ...style
      }}>
      {children}
    </Surface>
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
