import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { OMGText } from '../../widgets'

const ScrollElement = ({ theme, element }) => {
  return (
    <View style={styles.container}>
      <OMGText style={[styles.text(theme), styles.header]} weight='bold'>
        {element.large}
      </OMGText>
      <OMGText style={[styles.text(theme), styles.subheader]}>
        {element.small}
      </OMGText>
    </View>
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

export default withNavigation(withTheme(ScrollElement))
