import React from 'react'
import OnboardingContainer from './OnboardingContainer'
import { StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGButton } from 'components/widgets'

const OMGOnboardingSheetWithButton = ({
  theme,
  content,
  onPressedConfirm,
  onPressedDismiss,
  visible
}) => {
  const TextContent = content.paragraphs.map((paragraph, index) => {
    return (
      <OMGText style={styles.content(theme)} key={index}>
        {paragraph}
      </OMGText>
    )
  })

  return (
    <OnboardingContainer visible={visible} isModal={true} tourKey={content.key}>
      <OMGText style={styles.title(theme)} weight='mono-semi-bold'>
        {content.title}
      </OMGText>
      {TextContent}
      {content.buttonTextConfirm && (
        <OMGButton
          style={styles.buttonConfirm(theme)}
          textStyle={styles.buttonTextConfirm(theme)}
          onPress={onPressedConfirm}>
          {content.buttonTextConfirm}
        </OMGButton>
      )}
      {content.buttonTextDismiss && (
        <OMGButton
          style={styles.buttonDismiss(theme)}
          onPress={onPressedDismiss}>
          {content.buttonTextDismiss}
        </OMGButton>
      )}
    </OnboardingContainer>
  )
}

const styles = StyleSheet.create({
  title: theme => ({
    color: theme.colors.white,
    fontSize: 24
  }),
  content: theme => ({
    marginTop: 10,
    color: theme.colors.primary,
    textAlign: 'center',
    fontSize: 14
  }),
  buttonConfirm: theme => ({
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.white,
    marginTop: 30,
    borderWidth: 1
  }),
  buttonTextConfirm: theme => ({
    color: theme.colors.primary
  }),
  buttonDismiss: theme => ({
    color: theme.colors.white,
    borderColor: theme.colors.white,
    borderWidth: 1,
    backgroundColor: theme.colors.primary,
    marginTop: 10
  })
})

export default withTheme(OMGOnboardingSheetWithButton)
