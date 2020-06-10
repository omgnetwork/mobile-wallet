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
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <OnboardingDisclaimer
            width={Styles.getResponsiveSize(140, { small: 99, medium: 120 })}
            height={Styles.getResponsiveSize(116, { small: 83, medium: 99 })}
            style={styles.image}
          />
          <OMGText style={styles.headerText} weight='regular'>
            Nice choice! But before you start, let’s make sure we’re on the same
            page :)
          </OMGText>
        </View>
        <OMGText style={styles.contentText1}>
          This wallet is your first official gateway to OmiseGO Network.
        </OMGText>
        <OMGText style={styles.contentText2}>
          Get first-hand experience of how the Plasma Layer-2 solution works.
          You can deposit and transfer any ERC-20 compliant token. Transactions
          will incur charges and fees that are collected in OMG.
        </OMGText>
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
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.black5,
      flexDirection: 'column',
      paddingHorizontal: Styles.getResponsiveSize(30, { small: 16, medium: 24 })
    },
    image: {
      marginTop: Styles.getResponsiveSize(24, { small: 16, medium: 16 })
    },
    headerContainer: {
      backgroundColor: theme.colors.black5
    },
    headerText: {
      color: theme.colors.white,
      fontSize: Styles.getResponsiveSize(30, { small: 20, medium: 28 }),
      marginTop: Styles.getResponsiveSize(24, { small: 12, medium: 20 })
    },
    contentContainer: {
      flexGrow: 1,
      backgroundColor: theme.colors.black5,
      paddingVertical: Styles.getResponsiveSize(24, { small: 8, medium: 16 })
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginTop: 16,
      backgroundColor: theme.colors.black5
    },
    contentText1: {
      marginTop: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
      color: theme.colors.gray6,
      fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
      lineHeight: Styles.getResponsiveSize(28, { small: 20, medium: 24 })
    },
    contentText2: {
      color: theme.colors.gray6,
      fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
      marginTop: 10,
      lineHeight: Styles.getResponsiveSize(28, { small: 20, medium: 24 })
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
