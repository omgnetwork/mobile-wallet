import React, { useCallback } from 'react'
import { View, ScrollView } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { OMGText, OMGButton, OMGStatusBar } from 'components/widgets'
import { OnboardingDisclaimer } from './assets'
import { disclaimerStyle } from './styles'

const Disclaimer = ({ navigation, theme }) => {
  const destination = navigation.getParam('destination')
  const handleAcceptPressed = useCallback(() => {
    navigation.navigate(destination)
  }, [destination, navigation])

  const handleDeclinePressed = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const styles = disclaimerStyle(theme)

  return (
    <SafeAreaView style={styles.container}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <View style={styles.headerContainer}>
        <OnboardingDisclaimer width={98} style={styles.image} />
        <OMGText style={styles.headerText} weight='regular'>
          Nice choice! But before you start, let’s make sure we’re on the same
          page :)
        </OMGText>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <OMGText style={styles.contentText1}>
          This wallet is your first official gateway to OmiseGO Network.
        </OMGText>
        <OMGText style={styles.contentText2}>
          The application has been set up for purely educational purposes, to
          provide insight on how plasma layer two solutions work. Transactions
          on this wallet will be using ETH in real time and may incur
          transaction charges. Practice prudence with each transaction.
        </OMGText>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.confirmButton}
          textStyle={styles.confirmButtonText}
          textweight='regular'
          onPress={handleAcceptPressed}>
          I UNDERSTAND AND ACCEPT
        </OMGButton>
        <OMGButton
          style={styles.declineButton}
          textStyle={styles.declineButtonText}
          onPress={handleDeclinePressed}
          textweight='regular'>
          DECLINE
        </OMGButton>
      </View>
    </SafeAreaView>
  )
}

export default withNavigation(withTheme(Disclaimer))
