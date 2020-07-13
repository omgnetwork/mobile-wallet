import React, { useCallback } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { OMGText, OMGButton, OMGStatusBar } from 'components/widgets'
import { OnboardingAgreement } from './assets'
import { Styles, Dimensions } from 'common/utils'

const { windowHeight } = Dimensions

const Agreement = ({ navigation, theme }) => {
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
        <OnboardingAgreement
          style={styles.image}
          width={windowHeight * 0.15}
          height={windowHeight * 0.15}
        />
        <OMGText style={styles.headerText} weight='regular'>
          Before you begin, let’s make sure we’re on the same page.
        </OMGText>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        indicatorStyle='white'>
        <>
          <OMGText style={styles.contentText1} weight='regular'>
            This wallet is your first official gateway to OmiseGO Network.
          </OMGText>
          <OMGText style={styles.contentText2} weight='regular'>
            Get first-hand experience of how the Plasma Layer-2 solution works.
            You can deposit and transfer any ERC-20 compliant token.
            Transactions will incur charges and fees that are collected in OMG.
          </OMGText>
        </>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.confirmButton}
          textStyle={styles.confirmButtonText}
          textweight='regular'
          onPress={handleAcceptPressed}>
          ACCEPT
        </OMGButton>
        <OMGButton
          style={styles.declineButton}
          textStyle={styles.declineButtonText}
          textweight='regular'
          onPress={handleDeclinePressed}>
          DECLINE
        </OMGButton>
      </View>
    </SafeAreaView>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
      flexDirection: 'column',
      paddingHorizontal: Styles.getResponsiveSize(30, { small: 16, medium: 24 })
    },
    image: {
      marginTop: Styles.getResponsiveSize(24, { small: 16, medium: 16 })
    },
    headerContainer: {
      alignItems: 'center',
      paddingVertical: 16
    },
    headerText: {
      color: theme.colors.black5,
      textAlign: 'center',
      opacity: 0.8,
      fontSize: Styles.getResponsiveSize(28, { small: 20, medium: 24 }),
      marginTop: Styles.getResponsiveSize(30, { small: 20, medium: 24 })
    },
    scrollContainer: {
      flexGrow: 1,
      flexDirection: 'column',
      paddingRight: 16,
      marginVertical: 16
    },
    buttonContainer: {
      justifyContent: 'flex-end',
      paddingVertical: 16
    },
    contentText1: {
      color: theme.colors.black5,
      fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
      lineHeight: Styles.getResponsiveSize(28, { small: 20, medium: 24 })
    },
    contentText2: {
      color: theme.colors.black5,
      fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
      marginTop: 10,
      lineHeight: Styles.getResponsiveSize(28, { small: 20, medium: 24 })
    },
    confirmButton: {
      width: 180,
      backgroundColor: theme.colors.primary,
      borderRadius: 22
    },
    confirmButtonText: {
      color: theme.colors.white
    },
    declineButton: {
      width: 280,
      backgroundColor: 'transparent',
      marginTop: 16
    },
    declineButtonText: {
      color: theme.colors.black5
    }
  })

export default withNavigation(withTheme(Agreement))
