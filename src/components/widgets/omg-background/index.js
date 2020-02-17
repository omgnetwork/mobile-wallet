import React from 'react'
import { withTheme, Surface } from 'react-native-paper'

const OMGBackground = ({ theme, children, style }) => {
  const { colors } = theme

  return (
    <Surface style={{ backgroundColor: colors.black5, ...style }}>
      {children}
    </Surface>
  )
}

OMGBackground.propTypes = {}

export default withTheme(OMGBackground)
