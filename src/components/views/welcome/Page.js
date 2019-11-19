import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { OMGText } from 'components/widgets'
import { Dimensions } from 'common/utils'
import * as WelcomeImages from './assets'
const Page = ({ theme, textTitle, textContent, image }) => {
  const WelcomeImage = WelcomeImages[image]
  return (
    <View style={styles.container}>
      <WelcomeImage style={styles.image} />
      <OMGText style={[styles.text(theme), styles.header]} weight='bold'>
        {textTitle}
      </OMGText>
      {textContent && (
        <OMGText style={[styles.text(theme), styles.subheader]}>
          {textContent}
        </OMGText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.windowWidth,
    padding: 30
  },
  text: theme => ({
    marginTop: 48,
    color: theme.colors.white,
    textAlign: 'left'
  }),
  image: {},
  subheader: {
    fontSize: 18,
    marginTop: 10,
    opacity: 0.6
  },
  header: {
    fontSize: 30
  }
})

export default withNavigation(withTheme(Page))
