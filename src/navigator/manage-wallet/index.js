import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default (
  ImportWalletNavigator,
  CreateWalletNavigator,
  BackupWalletNavigator
) =>
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
      },
      BackupWallet: {
        screen: Views.Backup,
        params: {
          navigator: BackupWalletNavigator
        }
      }
    },
    {
      initialRouteName: 'ManageWallet',
      headerMode: 'none'
    }
  )
