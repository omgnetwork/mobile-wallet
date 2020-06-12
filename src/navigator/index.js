import { createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import createMainDrawerNavigator from './main'
import DepositNavigator from './deposit'
import createTransferNavigator from './transfer'
import ExitNavigator from './exit'
import ImportWalletNavigator from './import-wallet'
import BackupWalletNavigator from './backup-wallet'
import CreateWalletNavigator from './create-wallet'
import ProcessExitNavigator from './process-exit'
import TransactionHistoryNavigator from './transaction-history'
import createWelcomeNavigator from './welcome'
import WarpPortal from './warp-portal'
import * as Views from 'components/views'

const MainDrawerNavigator = createMainDrawerNavigator()

const SelectAddressTransferNavigator = createTransferNavigator(false)
const SelectTokenTransferNavigator = createTransferNavigator(true)

Views.Main.router = MainDrawerNavigator.router
Views.Transfer.router = SelectAddressTransferNavigator.router
Views.TransferScan.router = SelectTokenTransferNavigator.router
Views.Deposit.router = DepositNavigator.router
Views.Exit.router = ExitNavigator.router
Views.ImportWallet.router = ImportWalletNavigator.router
Views.CreateWallet.router = CreateWalletNavigator.router
Views.Backup.router = BackupWalletNavigator.router
Views.ProcessExit.router = ProcessExitNavigator.router

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
    },
    Transfer: {
      screen: Views.Transfer,
      params: {
        navigator: SelectAddressTransferNavigator
      }
    },
    TransferScan: {
      screen: Views.TransferScan,
      params: {
        navigator: SelectTokenTransferNavigator
      }
    },
    TransferScanner: {
      screen: Views.TransferScanner
    },
    TransferScannerConfirm: {
      screen: Views.TransferScannerConfirm
    },
    Receive: {
      screen: Views.Receive
    },
    DeleteWallet: {
      screen: Views.DeleteWallet
    },
    ProcessExit: {
      screen: Views.ProcessExit,
      params: {
        navigator: ProcessExitNavigator
      }
    },
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
    TransactionHistory: {
      screen: TransactionHistoryNavigator
    }
  },
  {
    initialRouteName: 'Main',
    initialRouteKey: 'Root',
    headerMode: 'none'
  }
)
export const WarpPortalNavigator = WarpPortal
