import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Dimensions, StyleSheet, View } from 'react-native'
import { OMGText } from '../../widgets'

const deviceWidth = Dimensions.get('window').width

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
    width: deviceWidth,
    justifyContent: 'center',
    height: 300
  },
  text: theme => ({
    color: theme.colors.white,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center'
  }),
  subheader: {
    fontSize: 20,
    marginTop: 20
  },
  header: {
    fontSize: 30
  }
})

export default withNavigation(withTheme(ScrollElement))
