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
      <View style={styles.textContent}>
        <OMGText style={[styles.text(theme), styles.header]} weight='mono-semi-bold'>
          {textTitle}
        </OMGText>
        {textContent && (
          <OMGText
            style={[styles.text(theme), styles.subheader]}
            weight='regular'>
            {textContent}
          </OMGText>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    width: Dimensions.windowWidth,
    paddingHorizontal: 30,
    marginBottom: 16
  },
  text: theme => ({
    color: theme.colors.white,
    textAlign: 'left'
  }),
  image: {},
  textContent: {},
  subheader: {
    fontSize: 18,
    opacity: 0.6,
    lineHeight: 25,
    marginTop: 10
  },
  header: {
    fontSize: 30
  }
})

export default withNavigation(withTheme(Page))
