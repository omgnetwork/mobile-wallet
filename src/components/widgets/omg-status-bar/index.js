import React from 'react'
import { StatusBar, StyleSheet, View, Platform } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGStatusBar = ({ theme, style, backgroundColor, barStyle }) => {
  return (
    <StatusBar
      barStyle={barStyle || 'light-content'}
      backgroundColor={backgroundColor || theme.colors.black5}
    />
  )
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight

const styles = StyleSheet.create({
  statusBar: theme => ({
    height: STATUSBAR_HEIGHT,
    backgroundColor: theme.colors.black5
  })
})

export default withTheme(OMGStatusBar)
