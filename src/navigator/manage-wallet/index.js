import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default (ImportWalletNavigator, CreateWalletNavigator) =>
  createStackNavigator(
    {
      ManageWallet: Views.ManageWallet,
      ImportWallet: {
        screen: Views.ImportWallet,
        params: {
          navigator: ImportWalletNavigator
        }
      },
      CreateWallet: {
        screen: Views.CreateWallet,
        params: {
          navigator: CreateWalletNavigator
        }
      }
    },
    {
      initialRouteName: 'ManageWallet',
      headerMode: 'none'
    }
  )
