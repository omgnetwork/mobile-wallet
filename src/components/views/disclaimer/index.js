import React, { useCallback } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { OMGText, OMGButton } from 'components/widgets'
import { OnboardingDisclaimer } from './assets'

const Disclaimer = ({ navigation, theme }) => {
  const destination = navigation.getParam('destination')
  const handleAcceptPressed = useCallback(() => {
    navigation.navigate(destination)
  }, [destination, navigation])

  const handleDeclinePressed = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer(theme)}>
          <OnboardingDisclaimer width={98} style={styles.image} />
          <OMGText style={styles.headerText(theme)} weight='bold'>
            Nice choice! But before you start, let’s make sure we’re on the same
            page :)
          </OMGText>
        </View>
        <View style={styles.contentContainer(theme)}>
          <OMGText style={styles.contentText1(theme)}>
            This wallet is your first official gateway to OmiseGO Network.
          </OMGText>
          <OMGText style={styles.contentText2(theme)}>
            The application has been set up for purely educational purposes, to
            provide insight on how plasma layer two solutions work. Transactions
            on this wallet will be using ETH in real time and may incur
            transaction charges. Practice prudence with each transaction.
          </OMGText>
          <View style={styles.buttonContainer}>
            <OMGButton
              style={styles.confirmButton(theme)}
              textStyle={styles.confirmButtonText(theme)}
              textWeight='medium'
              onPress={handleAcceptPressed}>
              I UNDERSTAND AND ACCEPT
            </OMGButton>
            <OMGButton
              style={styles.declineButton(theme)}
              textStyle={styles.declineButtonText(theme)}
              onPress={handleDeclinePressed}
              textWeight='medium'>
              DECLINE
            </OMGButton>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  image: {},
  headerContainer: theme => ({
    padding: 30,
    backgroundColor: theme.colors.gray3
  }),
  headerText: theme => ({
    color: theme.colors.white,
    fontSize: 30,
    marginTop: 28
  }),
  contentContainer: theme => ({
    flexDirection: 'column',
    paddingVertical: 40,
    paddingHorizontal: 30,
    backgroundColor: theme.colors.white
  }),
  contentText1: theme => ({
    color: theme.colors.primary,
    fontSize: 18
  }),
  contentText2: theme => ({
    marginTop: 40,
    color: theme.colors.primary,
    fontSize: 18
  }),
  confirmButton: theme => ({
    backgroundColor: theme.colors.gray3,
    borderRadius: theme.roundness
  }),
  confirmButtonText: theme => ({
    color: theme.colors.white
  }),
  declineButton: theme => ({
    backgroundColor: 'transparent',
    marginTop: 16
  }),
  declineButtonText: theme => ({
    color: theme.colors.gray3
  }),
  buttonContainer: {
    marginTop: 40
  }
})

export default withNavigation(withTheme(Disclaimer))