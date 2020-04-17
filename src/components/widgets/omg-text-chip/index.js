import React from 'react'
import { TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import omgTextChipStyles from './styles'

const OMGTextChip = ({ theme, text, style, onPress }) => {
  const styles = omgTextChipStyles(theme)
  return (
    <TouchableOpacity
      style={{ ...styles.container, ...style }}
      onPress={onPress}>
      <OMGText style={styles.text}>{text}</OMGText>
    </TouchableOpacity>
  )
}

export default withTheme(OMGTextChip)
