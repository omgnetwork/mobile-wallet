import React from 'react'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { OMGText } from '../../widgets'

const Card = ({ navigation, theme, color, header, description }) => {
  return (
    <TouchableOpacity>
      <View style={{ ...styles.container, backgroundColor: color }}>
        <OMGText style={[styles.text(theme), styles.header]} weight='bold'>
          {header}
        </OMGText>
        <OMGText style={[styles.text(theme), styles.subheader]}>
          {description}
        </OMGText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: 100
  },
  text: theme => ({
    color: theme.colors.white,
    marginLeft: 20
  }),
  subheader: {
    fontSize: 12
  },
  header: {
    fontSize: 20
  }
})

export default withNavigation(withTheme(Card))
