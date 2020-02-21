import React from 'react'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { OMGFontIcon, OMGText } from '../../widgets'

const CardMenu = ({ theme, color, header, description, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.container, backgroundColor: color, ...style }}>
      <View>
        <OMGText
          style={[styles.text(theme), styles.header]}
          weight='mono-semi-bold'>
          {header}
        </OMGText>
        <OMGText style={[styles.text(theme), styles.subheader]}>
          {description}
        </OMGText>
      </View>
      <OMGFontIcon name='chevron-right' size={24} style={styles.arrow(theme)} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  arrow: theme => ({
    color: theme.colors.white
  }),
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },

  text: theme => ({
    color: theme.colors.white
  }),
  subheader: {
    fontSize: 12,
    opacity: 0.6
  },
  header: {
    fontSize: 18
  }
})

export default withNavigation(withTheme(CardMenu))
