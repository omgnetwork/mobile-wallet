import React from 'react'
import OnboardingContainer from './OnboardingContainer'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import * as TourImages from './assets'

const OMGOnboardingSheet = ({ theme, content, visible }) => {
  const ImageCenter = TourImages[content.imageCenterName]
  const ImageBottom = TourImages[content.imageBottomName]

  return (
    <OnboardingContainer visible={visible} tourKey={content.key}>
      <OMGText style={styles.title(theme)} weight='mono-semi-bold'>
        {content.title}
      </OMGText>
      <ImageCenter width={280} style={styles.imageCenter} />
      <View style={styles.bottomContainer}>
        <View style={styles.bottomTextContainer}>
          <OMGText style={styles.textBottomBig(theme)} weight='mono-semi-bold'>
            {content.textBottomBig}
          </OMGText>
          <OMGText style={styles.textBottomSmall(theme)}>
            {content.textBottomSmall}
          </OMGText>
        </View>
        <ImageBottom width={54} height={54} style={styles.imageBottom} />
      </View>
    </OnboardingContainer>
  )
}

const styles = StyleSheet.create({
  title: theme => ({
    color: theme.colors.white,
    fontSize: 24
  }),
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bottomTextContainer: {
    marginRight: 10,
    flexDirection: 'column'
  },
  textBottomBig: theme => ({
    color: theme.colors.white,
    fontSize: 14
  }),
  textBottomSmall: theme => ({
    color: theme.colors.blue3,
    fontSize: 10
  }),
  imageCenter: {
    marginVertical: 20
  },
  imageBottom: {}
})

export default withTheme(OMGOnboardingSheet)
