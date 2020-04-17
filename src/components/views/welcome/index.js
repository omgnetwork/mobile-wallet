import React from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Image, View } from 'react-native'
import CardMenu from './CardMenu'
import { OMGDotViewPager, OMGStatusBar } from 'components/widgets'
import Page from './Page'
import { welcomeStyles } from './styles'
const PageItems = [
  {
    title: 'Welcome to\nthe Plasma Wallet',
    content: 'Official gateway to the OmiseGo network.',
    image: 'Welcome1'
  },
  {
    title: 'Plasma makes blockchain faster, affordable, and more secure',
    image: 'Welcome2'
  },
  {
    title: "Learn to transact on OmiseGO's Plasma Scaling Solution",
    content:
      'Set up and manage wallets, review your activity, move ETH, and more',
    image: 'Welcome3'
  }
].map((item, index) => {
  return (
    <Page
      textTitle={item.title}
      textContent={item.content}
      image={item.image}
      key={index}
    />
  )
})

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

  const styles = welcomeStyles(theme)

  return (
    <SafeAreaView style={styles.container}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black}
      />
      <Image
        style={styles.logo}
        source={require('../../../../assets/omisego-logo.png')}
      />
      <View style={styles.scroll}>
        <OMGDotViewPager>{PageItems}</OMGDotViewPager>
      </View>
      <CardMenu
        style={styles.cardMenu}
        color={theme.colors.primary}
        header='Sync Your Wallet'
        description='Use own Ethereum Address with this wallet'
        onPress={navigateImportWallet}
      />
      <CardMenu
        style={styles.cardMenu}
        color={theme.colors.black}
        header='Create New Wallet'
        description='Create wallet for the new Ethereum Address'
        onPress={navigateCreateWallet}
      />
    </SafeAreaView>
  )
}

export default withNavigation(withTheme(Welcome))
