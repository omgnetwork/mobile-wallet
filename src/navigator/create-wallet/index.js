import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'
import { TransitionPresets } from 'react-navigation-stack'

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
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      cardStyle: { opacity: 1, backgroundColor: 'transparent' }
    }
  }
)
