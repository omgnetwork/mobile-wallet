import React, { useEffect } from 'react'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { OMGButton, OMGText } from 'components/widgets'
import OnboardingContainer from './OnboardingContainer'

const OMGOnboardingPopup = ({
  theme,
  content,
  visible,
  onPressedDismiss,
  position
}) => {
  return (
    <OnboardingContainer
      visible={visible}
      isPopup={true}
      tourName={content.tourName}
      arrowDirection={content.arrowDirection}
      position={position}>
      <View style={styles.container(theme)}>
        <OMGText weight='bold' style={styles.title(theme)}>
          {content.title}
        </OMGText>
        <OMGText style={styles.text(theme)}>{content.text}</OMGText>
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
    borderColor: theme.colors.blue5,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.blue5,
    flexDirection: 'column',
    alignItems: 'flex-end'
  }),
  title: theme => ({
    alignSelf: 'flex-start',
    color: theme.colors.white
  }),
  text: theme => ({
    color: theme.colors.white3,
    marginTop: 20
  }),
  buttonContainer: {
    marginTop: 20
  },
  button: theme => ({
    width: 80,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.blue5
  }),
  buttonText: theme => ({
    color: theme.colors.white
  })
})

export default withTheme(OMGOnboardingPopup)
