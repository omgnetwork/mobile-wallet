import React from 'react'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { OMGButton, OMGText } from 'components/widgets'
import OnboardingContainer from './OnboardingContainer'
import * as TourImages from './assets'

const OMGOnboardingPopup = ({
  theme,
  content,
  visible,
  onPressedDismiss,
  position
}) => {
  const ImageBottom = TourImages[content.imageBottomName]

  const TextContent = content.paragraphs.map((paragraph, key) => {
    return (
      <OMGText style={styles.text(theme)} weight='book' key={key}>
        {paragraph}
      </OMGText>
    )
  })

  return (
    <OnboardingContainer
      visible={visible}
      isPopup={true}
      tourKey={content.key}
      arrowDirection={content.arrowDirection}
      position={position}>
      <View style={styles.container(theme)}>
        <OMGText weight='semi-bold' style={styles.title(theme)}>
          {content.title}
        </OMGText>
        <View style={styles.textContainer}>{TextContent}</View>
        {ImageBottom && <ImageBottom style={styles.image} />}
        <View style={styles.buttonContainer}>
          <OMGButton
            style={styles.button(theme)}
            onPress={onPressedDismiss}
            textStyle={styles.buttonText(theme)}>
            {content.buttonText}
          </OMGButton>
        </View>
      </View>
    </OnboardingContainer>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    padding: 20,
    borderColor: theme.colors.primary,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
    flexDirection: 'column'
  }),
  title: theme => ({
    alignSelf: 'flex-start',
    fontSize: 16,
    color: theme.colors.white
  }),
  textContainer: {
    justifyContent: 'flex-start'
  },
  text: theme => ({
    color: theme.colors.white2,
    marginTop: 20
  }),
  image: {
    marginTop: 16,
    alignSelf: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20
  },
  button: theme => ({
    width: 80,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.primary
  }),
  buttonText: theme => ({
    color: theme.colors.white
  })
})

export default withTheme(OMGOnboardingPopup)
