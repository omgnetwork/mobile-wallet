import React from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { withTheme, Surface } from 'react-native-paper'

const OMGBackground = ({ theme, children, style }) => {
  const { colors } = theme

  return (
    <Surface style={{ backgroundColor: colors.background, ...style }}>
      {children}
    </Surface>
  )
}

OMGBackground.propTypes = {}

export default withTheme(OMGBackground)
