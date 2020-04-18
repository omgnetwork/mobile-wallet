import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import { Styles } from 'common/utils'

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
    width: '30%',
    backgroundColor: theme.colors.black5,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.gray4
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    letterSpacing: -0.72,
    textTransform: 'capitalize'
  })
})

export default withTheme(OMGTextChip)
