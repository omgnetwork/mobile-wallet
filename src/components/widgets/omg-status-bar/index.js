import React from 'react'
import { StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGStatusBar = ({ theme, style, backgroundColor, barStyle }) => {
  return (
    <StatusBar
      barStyle={barStyle || 'light-content'}
      backgroundColor={backgroundColor || theme.colors.black}
    />
  )
}

export default withTheme(OMGStatusBar)
