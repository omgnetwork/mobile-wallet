import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'
import { TransitionPresets } from 'react-navigation-stack'

export default (ImportWalletNavigator, CreateWalletNavigator) =>
  createStackNavigator(
    {
      Welcome: Views.Welcome,
      Disclaimer: Views.Disclaimer,
      WelcomeImportWallet: {
        screen: Views.ImportWallet,
        params: {
          navigator: ImportWalletNavigator
        }
      },
      WelcomeCreateWallet: {
        screen: Views.CreateWallet,
        params: {
          navigator: CreateWalletNavigator
        }
      }
    },
    {
      initialRouteName: 'Welcome',
      headerMode: 'none',
      defaultNavigationOptions: {
        ...TransitionPresets.SlideFromRightIOS,
        cardStyle: { opacity: 1, backgroundColor: 'transparent' }
      }
    }
  )
