import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

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
      headerMode: 'none'
    }
  )
