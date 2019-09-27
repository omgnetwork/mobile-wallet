import React from 'react'
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import OMGText from '../omg-text'
import OMGIcon from '../omg-icon'
import { withTheme } from 'react-native-paper'

const OMGMenuImage = ({ title, description, style, theme, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <Image
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${title}.png`
        }}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.title(theme)} weight='bold'>
          {title}
        </OMGText>
        <OMGText style={styles.description(theme)}>{description}</OMGText>
      </View>
      <OMGIcon name='chevron-right' size={24} />
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
    fontSize: 14,
    textTransform: 'uppercase',
    color: theme.colors.primary
  }),
  description: theme => ({
    color: theme.colors.gray5,
    fontSize: 12
  })
})

export default withTheme(OMGMenuImage)
