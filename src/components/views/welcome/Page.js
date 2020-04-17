import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View } from 'react-native'
import { OMGText } from 'components/widgets'
import * as WelcomeImages from './assets'
import { pageStyles } from './styles'
const Page = ({ theme, textTitle, textContent, image }) => {
  const WelcomeImage = WelcomeImages[image]
  const styles = pageStyles(theme)
  return (
    <View style={styles.container}>
      <WelcomeImage style={styles.image} />
      <View style={styles.textContent}>
        <OMGText style={[styles.text, styles.header]} weight='mono-semi-bold'>
          {textTitle}
        </OMGText>
        {textContent && (
          <OMGText style={[styles.text, styles.subheader]} weight='regular'>
            {textContent}
          </OMGText>
        )}
      </View>
    </View>
  )
}

export default withNavigation(withTheme(Page))
