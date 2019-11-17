import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { OMGText } from 'components/widgets'
import { Dimensions } from 'common/utils'

const Page = ({ theme, textTitle, textContent }) => {
  return (
    <View style={styles.container}>
      <OMGText style={[styles.text(theme), styles.header]} weight='bold'>
        {textTitle}
      </OMGText>
      <OMGText style={[styles.text(theme), styles.subheader]}>
        {textContent}
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.windowWidth,
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

export default withNavigation(withTheme(Page))
