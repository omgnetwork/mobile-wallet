import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import OMGText from '../omg-text'
import OMGFontIcon from '../omg-font-icon'
import { Styles } from 'common/utils'
import { withTheme } from 'react-native-paper'

const OMGMenuIcon = ({
  title,
  description,
  iconName,
  style,
  theme,
  menuRef,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      ref={menuRef}
      onPress={onPress}>
      <View style={styles.imageContainer(theme)}>
        <OMGFontIcon color={theme.colors.white} size={18} name={iconName} />
      </View>
      <View style={styles.sectionName}>
        <OMGText style={styles.title(theme)}>{title}</OMGText>
        <OMGText style={styles.description(theme)}>{description}</OMGText>
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
  imageContainer: theme => ({
    width: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    height: Styles.getResponsiveSize(40, { small: 24, medium: 32 }),
    padding: Styles.getResponsiveSize(10, { small: 4, medium: 6 }),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.white
  }),
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 16
  },
  title: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: -0.64,
    color: theme.colors.white
  }),
  description: theme => ({
    color: theme.colors.gray6,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 10 })
  })
})

export default withTheme(OMGMenuIcon)
