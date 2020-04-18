import React from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Image, View, StyleSheet } from 'react-native'
import CardMenu from './CardMenu'
import { OMGDotViewPager, OMGStatusBar } from 'components/widgets'
import Page from './Page'

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

  return (
    <SafeAreaView style={styles.container(theme)}>
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

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black,
    justifyContent: 'space-around'
  }),
  logo: {
    width: 130,
    height: 44,
    marginTop: 16,
    marginLeft: 30
  },
  cardMenu: {
    flex: 3
  },
  scroll: {
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20
  }
})

export default withNavigation(withTheme(Welcome))
