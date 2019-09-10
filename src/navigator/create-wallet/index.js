import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    CreateWalletForm: Views.CreateWalletForm,
    CreateWalletBackupWarning: Views.CreateWalletBackupWarning,
    CreateWalletBackupMnemonic: Views.CreateWalletBackupMnemonic
  },
  {
    initialRouteName: 'CreateWalletForm',
    headerMode: 'none'
  }
)
