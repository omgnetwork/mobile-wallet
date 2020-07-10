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
      <WelcomeImage width='90%' height='40%' />
      <OMGText style={[styles.text(theme), styles.header]} weight='bold'>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    paddingHorizontal: 30,
    marginBottom: 16
  },
  text: theme => ({
    color: theme.colors.white,
    textAlign: 'center'
  }),
  subheader: {
    fontSize: Styles.getResponsiveSize(20, { small: 16, medium: 18 }),
    opacity: 0.6,
    lineHeight: 25
  },
  header: {
    fontSize: Styles.getResponsiveSize(32, { small: 24, medium: 28 })
  }
})

export default withNavigation(withTheme(Page))
