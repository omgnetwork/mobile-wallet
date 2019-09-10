import Home from './home'
import TransferChildChainNavigator from './transfer-childchain'
import TransferRootChainNavigator from './transfer-rootchain'
import ImportWalletNavigator from './import-wallet'
import BackupWalletNavigator from './backup-wallet'
import CreateWalletNavigator from './create-wallet'
import ManageWalletNavigator from './manage-wallet'
import WarpPortal from './warp-portal'
import * as Views from 'components/views'

Views.Transfer.router = TransferRootChainNavigator.router
Views.Deposit.router = TransferChildChainNavigator.router
Views.ImportWallet.router = ImportWalletNavigator.router
Views.CreateWallet.router = CreateWalletNavigator.router
Views.Backup.router = BackupWalletNavigator.router

export const AppNavigator = Home(
  TransferRootChainNavigator,
  TransferChildChainNavigator,
  ManageWalletNavigator(
    ImportWalletNavigator,
    CreateWalletNavigator,
    BackupWalletNavigator
  )
)

export const WarpPortalNavigator = WarpPortal
