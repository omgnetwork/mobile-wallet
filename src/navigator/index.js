import { createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import createMainDrawerNavigator from './main'
import DepositNavigator from './deposit'
import TransferNavigator from './transfer'
import ExitNavigator from './exit'
import ImportWalletNavigator from './import-wallet'
import BackupWalletNavigator from './backup-wallet'
import CreateWalletNavigator from './create-wallet'
import ManageWalletNavigator from './manage-wallet'
import TransactionHistoryNavigator from './transaction-history'
import createWelcomeNavigator from './welcome'
import WarpPortal from './warp-portal'
import * as Views from 'components/views'

const MainDrawerNavigator = createMainDrawerNavigator(
  TransferNavigator,
  TransactionHistoryNavigator
)

Views.Main.router = MainDrawerNavigator.router
Views.Transfer.router = TransferNavigator.router
Views.Deposit.router = DepositNavigator.router
Views.Exit.router = ExitNavigator.router
Views.ImportWallet.router = ImportWalletNavigator.router
Views.CreateWallet.router = CreateWalletNavigator.router
Views.Backup.router = BackupWalletNavigator.router

const WelcomeNavigator = createWelcomeNavigator(
  ImportWalletNavigator,
  CreateWalletNavigator
)

const InitializationNavigator = createSwitchNavigator(
  {
    Initializer: Views.Initializer,
    Welcome: WelcomeNavigator,
    MainContent: {
      screen: Views.Main,
      params: {
        navigator: MainDrawerNavigator
      }
    }
  },
  {
    initialRouteName: 'Initializer',
    headerMode: 'none'
  }
)

export const AppNavigator = createStackNavigator(
  {
    Main: InitializationNavigator,
    ManageWallet: ManageWalletNavigator(
      ImportWalletNavigator,
      CreateWalletNavigator,
      BackupWalletNavigator
    ),
    TransferSelectBalance: {
      screen: Views.TransferSelectBalance
    },
    TransferSelectFee: {
      screen: Views.TransferSelectFee
    },
    TransferPending: {
      screen: Views.TransferPending,
      navigationOptions: () => ({ gesturesEnabled: false })
    },
    TransferDeposit: {
      screen: Views.Deposit,
      params: {
        navigator: DepositNavigator
      }
    },
    TransferExit: {
      screen: Views.Exit,
      params: {
        navigator: ExitNavigator
      }
    },
    ExitPending: Views.ExitPending
  },
  {
    initialRouteName: 'Main',
    initialRouteKey: 'Root',
    headerMode: 'none'
  }
)
export const WarpPortalNavigator = WarpPortal
