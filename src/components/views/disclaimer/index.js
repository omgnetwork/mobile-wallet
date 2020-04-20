import React, { useCallback } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { OMGText, OMGButton, OMGStatusBar } from 'components/widgets'
import { OnboardingDisclaimer } from './assets'
import { Styles } from 'common/utils'

const Disclaimer = ({ navigation, theme }) => {
  const destination = navigation.getParam('destination')
  const handleAcceptPressed = useCallback(() => {
    navigation.navigate(destination)
  }, [destination, navigation])

  const handleDeclinePressed = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const styles = createStyles(theme)

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

const createStyles = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.black5,
      flexDirection: 'column'
    },
    image: {
      marginTop: Styles.getResponsiveSize(32, { small: 16, medium: 24 })
    },
    headerContainer: {
      paddingHorizontal: 30,
      backgroundColor: theme.colors.black5
    },
    headerText: {
      color: theme.colors.white,
      fontSize: 30,
      marginTop: 28
    },
    contentContainer: {
      backgroundColor: theme.colors.black5,
      paddingHorizontal: 30,
      paddingVertical: Styles.getResponsiveSize(24, { small: 8, medium: 16 })
    },
    buttonContainer: {
      paddingHorizontal: 30,
      paddingVertical: 8,
      backgroundColor: theme.colors.black5
    },
    contentText1: {
      color: theme.colors.gray6,
      fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 14 }),
      lineHeight: Styles.getResponsiveSize(28, { small: 20, medium: 20 })
    },
    contentText2: {
      color: theme.colors.gray6,
      fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 14 }),
      marginTop: 10,
      lineHeight: Styles.getResponsiveSize(28, { small: 20, medium: 20 })
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.roundness
    },
    confirmButtonText: {
      color: theme.colors.white
    },
    declineButton: {
      backgroundColor: 'transparent',
      marginTop: 8
    },
    declineButtonText: {
      color: theme.colors.white
    }
  })

export default withNavigation(withTheme(Disclaimer))
