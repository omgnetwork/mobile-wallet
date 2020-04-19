import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon, OMGIdenticon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

const OMGMenuImage = ({ title, description, style, theme, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <OMGIdenticon
        style={styles.logo}
        hash={title}
        size={Styles.getResponsiveSize(40, { small: 24, medium: 32 })}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.title(theme)}>{title}</OMGText>
        <OMGText style={styles.description(theme)}>{description || ''}</OMGText>
      </View>
      <OMGFontIcon
        name='chevron-right'
        size={Styles.getResponsiveSize(24, { small: 16, medium: 20 })}
        color={theme.colors.white}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.black3,
    alignItems: 'center',
    padding: Styles.getResponsiveSize(20, { small: 12, medium: 16 })
  }),
  logo: {
    width: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    height: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    borderRadius: 4
  },
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 16
  },
  title: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    }),
    color: theme.colors.white
  }),
  description: theme => ({
    color: theme.colors.gray6,
    fontSize: 12
  })
})

export default withTheme(OMGMenuImage)
