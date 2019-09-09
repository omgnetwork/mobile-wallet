import Home from './home'
import TransferChildChainNavigator from './transfer-childchain'
import TransferRootChainNavigator from './transfer-rootchain'
import ImportWalletNavigator from './import-wallet'
import ManageWalletNavigator from './manage-wallet'
import WarpPortal from './warp-portal'
import * as Views from 'components/views'

Views.Transfer.router = TransferRootChainNavigator.router
Views.Deposit.router = TransferChildChainNavigator.router
Views.ImportWallet.router = ImportWalletNavigator.router

export const AppNavigator = Home(
  TransferRootChainNavigator,
  TransferChildChainNavigator,
  ManageWalletNavigator(ImportWalletNavigator)
)

export const WarpPortalNavigator = WarpPortal
