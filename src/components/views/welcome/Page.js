import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet, Dimensions } from 'react-native'
import { OMGText } from 'components/widgets'
import * as WelcomeImages from './assets'
import { Styles } from 'common/utils'

const Page = ({ theme, textTitle, textContent, image }) => {
  const WelcomeImage = WelcomeImages[image]
  return (
    <View style={styles.container}>
      <WelcomeImage />
      <View>
        <OMGText
          style={[styles.text(theme), styles.header]}
          weight='mono-semi-bold'>
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
    width: Dimensions.get('window').width,
    paddingHorizontal: 30,
    marginBottom: 16
  },
  text: theme => ({
    color: theme.colors.white,
    textAlign: 'left'
  }),
  subheader: {
    fontSize: Styles.getResponsiveSize(20, { small: 16, medium: 18 }),
    opacity: 0.6,
    lineHeight: 25,
    marginTop: 10
  },
  header: {
    fontSize: Styles.getResponsiveSize(30, { small: 20, medium: 24 })
  }
})

export default withNavigation(withTheme(Page))
