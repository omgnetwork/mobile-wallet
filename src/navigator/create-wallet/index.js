import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    CreateWalletForm: Views.CreateWalletForm,
    CreateWalletBackupWarning: Views.BackupWarning,
    CreateWalletBackupMnemonic: Views.CreateWalletBackupMnemonic,
    CreateWalletMnemonicConfirm: Views.CreateWalletMnemonicConfirm,
    CreateWalletMnemonicFailed: Views.CreateWalletMnemonicFailed
  },
  {
    initialRouteName: 'CreateWalletForm',
    headerMode: 'none'
  }
)
