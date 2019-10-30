import React from 'react'
import { connect } from 'react-redux'
import { settingActions } from 'common/actions'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Image, StyleSheet, View } from 'react-native'

import Card from './Card'
import Scroll from '../../widgets/omg-scroll'
import ScrollElement from './ScrollElement'

const scrollElements = [
  {
    large: 'Welcome to the Plasma Mobile Wallet',
    small: 'Your official gateway to the OmiseGo network.'
  },
  {
    large: 'The OmiseGo network turbocharges Ethereum',
    small:
      'It solves issues of affordability, speed and security for blockchain transactions.'
  },
  {
    large: 'Get started on the OmiseGo network',
    small:
      'Manage your wallets, monitor your activity, transfer digital assets and more.'
  }
].map((element, index) => {
  return <ScrollElement element={element} key={index} />
})

const Onboarding = ({
  navigation,
  theme,
  dispatchSetSkipOnboarding,
  skipOnboarding
}) => {
  const setSkipOnboarding = () => {
    dispatchSetSkipOnboarding(true)
  }
  return (
    <View style={styles.container(theme)}>
      <Image
        style={styles.logo}
        source={require('../../../../assets/omisego-logo.png')}
      />

      <View style={styles.scroll}>
        <Scroll children={scrollElements} scrollEnd={setSkipOnboarding} />
      </View>
      <View>
        <Card
          color={theme.colors.black3}
          header='Create New Wallet'
          description='With a new Ethereum address'
          onPress={() => navigation.navigate('CreateWallet')}
        />
        <Card
          color={theme.colors.blue6}
          header='Sync Your Wallet'
          description='With your existing Ethereum address'
          onPress={() => navigation.navigate('ImportWallet')}
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
  skipOnboarding: state.setting.skipOnboarding
})
const mapDispatchToProps = dispatch => ({
  dispatchSetSkipOnboarding: skip =>
    settingActions.setSkipOnboarding(dispatch, skip)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Onboarding)))