import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGImage = ({ source, theme, style }) => {
  return <Image style={{ ...styles.logo(theme), ...style }} source={source} />
}

const styles = StyleSheet.create({
  logo: theme => ({
    width: 40,
    height: 40,
    borderColor: theme.colors.background,
    borderRadius: theme.roundness,
    borderWidth: 0.5
  })
})

export default withTheme(OMGImage)
