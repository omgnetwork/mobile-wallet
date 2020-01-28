import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import OMGText from '../omg-text'
import OMGFontIcon from '../omg-font-icon'
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
        <OMGFontIcon color={theme.colors.gray3} size={18} name={iconName} />
      </View>
      <View style={styles.sectionName}>
        <OMGText style={styles.title(theme)} weight='mono-bold'>
          {title}
        </OMGText>
        <OMGText style={styles.description(theme)}>{description}</OMGText>
      </View>
      <OMGFontIcon name='chevron-right' size={24} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.white3,
    alignItems: 'center',
    padding: 20,
    borderRadius: theme.roundness
  }),
  imageContainer: theme => ({
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.black4
  }),
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 16
  },
  title: theme => ({
    fontSize: 14,
    color: theme.colors.primary,
    textTransform: 'uppercase'
  }),
  description: theme => ({
    color: theme.colors.gray5,
    fontSize: 12
  })
})

export default withTheme(OMGMenuIcon)
