import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default ImportWalletNavigator =>
  createStackNavigator(
    {
      ManageWallet: Views.ManageWallet,
      ImportWallet: {
        screen: Views.ImportWallet,
        params: {
          navigator: ImportWalletNavigator
        }
      }
    },
    {
      initialRouteName: 'ManageWallet',
      headerMode: 'none'
    }
  )
