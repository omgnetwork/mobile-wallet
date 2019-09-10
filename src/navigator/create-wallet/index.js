import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    CreateWalletForm: Views.CreateWalletForm,
    CreateWalletBackupWarning: Views.CreateWalletBackupWarning,
    CreateWalletBackupMnemonic: Views.CreateWalletBackupMnemonic,
    CreateWalletMnemonicConfirm: Views.CreateWalletMnemonicConfirm
  },
  {
    initialRouteName: 'CreateWalletForm',
    headerMode: 'none'
  }
)
