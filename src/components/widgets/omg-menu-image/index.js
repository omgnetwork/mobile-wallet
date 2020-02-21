import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon, OMGIdenticon } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGMenuImage = ({ title, description, style, theme, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <OMGIdenticon style={styles.logo} hash={title} size={40} />
      <View style={styles.sectionName}>
        <OMGText style={styles.title(theme)}>{title}</OMGText>
        <OMGText style={styles.description(theme)}>{description || ''}</OMGText>
      </View>
      <OMGFontIcon name='chevron-right' size={24} color={theme.colors.white} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.black3,
    alignItems: 'center',
    padding: 20
  }),
  logo: {
    width: 40,
    height: 40,
    borderRadius: 4
  },
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 16
  },
  title: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.white
  }),
  description: theme => ({
    color: theme.colors.gray6,
    fontSize: 12
  })
})

export default withTheme(OMGMenuImage)
