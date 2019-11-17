import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Image, StyleSheet, View } from 'react-native'
import CardButton from './CardButton'
import { OMGDotViewPager } from 'components/widgets'
import Page from './Page'

const PageItems = [
  {
    title: 'Welcome to the Plasma Mobile Wallet',
    content: 'Your official gateway to the OmiseGo network.'
  },
  {
    title: 'The OmiseGo network turbocharges Ethereum',
    content:
      'It solves issues of affordability, speed and security for blockchain transactions.'
  },
  {
    title: 'Get started on the OmiseGo network',
    content:
      'Manage your wallets, monitor your activity, transfer digital assets and more.'
  }
].map((item, index) => {
  return <Page textTitle={item.title} textContent={item.content} key={index} />
})

const Welcome = ({ navigation, theme, hasWallet }) => {
  const navigateCreateWallet = () => {
    navigation.navigate('WelcomeCreateWallet')
  }
  const navigateImportWallet = () => {
    navigation.navigate('WelcomeImportWallet')
  }
  return (
    <View style={styles.container(theme)}>
      <Image
        style={styles.logo}
        source={require('../../../../assets/omisego-logo.png')}
      />

      <View style={styles.scroll}>
        <OMGDotViewPager>{PageItems}</OMGDotViewPager>
      </View>
      <View>
        <CardButton
          color={theme.colors.black3}
          header='Create New Wallet'
          description='With a new Ethereum address'
          onPress={navigateCreateWallet}
        />
        <CardButton
          color={theme.colors.blue6}
          header='Sync Your Wallet'
          description='With your existing Ethereum address'
          onPress={navigateImportWallet}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.black5
  }),
  logo: {
    width: 150,
    height: 52,
    marginTop: 60,
    marginLeft: 30
  },
  scroll: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  scrollPoints: theme => ({
    height: 10,
    width: 10,
    backgroundColor: theme.colors.black4,
    margin: 8,
    borderRadius: 5
  })
})

const mapStateToProps = state => ({
  hasWallet: state.wallets.length > 0
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(Welcome)))
