import React from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'
import { View, StyleSheet, ImageBackground } from 'react-native'
import { OMGText, OMGStatusBar, OMGButton } from 'components/widgets'

const Welcome = ({ navigation, theme }) => {
  const navigateCreateWallet = () => {
    navigation.navigate('Disclaimer', {
      destination: 'WelcomeCreateWallet'
    })
  }
  const navigateImportWallet = () => {
    navigation.navigate('Disclaimer', {
      destination: 'WelcomeImportWallet'
    })
  }

  const imagePath = Styles.getResponsiveSize(
    require('./assets/welcome3x.png'),
    {
      small: require('./assets/welcome.png'),
      medium: require('./assets/welcome2x.png')
    }
  )

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black}
      />
      <ImageBackground source={imagePath} style={styles.contentContainer}>
        <View>
          <OMGText style={styles.textTitle(theme)} weight='semi-bold'>
            Experience{'\n'}the OMG Network
          </OMGText>
          <OMGText style={styles.textDescription(theme)} weight='book'>
            Specially developed for the OMG Network, our open-source Plasma
            Wallet is an educational tool that lets you make real Plasma
            transactions.
          </OMGText>
          <OMGButton
            onPress={navigateImportWallet}
            style={styles.btnImport(theme)}
            textWeight='book'
            textStyle={styles.textBtn(theme)}>
            Use Existing Wallet
          </OMGButton>
          <OMGButton
            onPress={navigateCreateWallet}
            style={styles.btnCreate(theme)}
            textWeight='book'
            textStyle={styles.textBtn(theme)}>
            Create New Wallet
          </OMGButton>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black,
    justifyContent: 'space-around'
  }),
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',

    paddingHorizontal: 30,
    paddingBottom: 24,
    resizeMode: 'cover'
  },
  textTitle: theme => ({
    color: theme.colors.white,
    fontSize: 32
  }),
  textDescription: theme => ({
    color: theme.colors.gray2,
    fontSize: 16,
    marginVertical: 24
  }),
  btnImport: theme => ({
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary
  }),
  btnCreate: theme => ({
    marginTop: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.black5
  }),
  textBtn: theme => ({
    color: theme.colors.white,
    fontSize: 16
  })
})

export default withNavigation(withTheme(Welcome))
