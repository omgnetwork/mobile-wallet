import Home from './home'
import TransferChildChainNavigator from './transfer-childchain'
import TransferRootChainNavigator from './transfer-rootchain'
import WarpPortal from './warp-portal'
import * as Views from 'components/views'

Views.Transfer.router = TransferRootChainNavigator.router
Views.Deposit.router = TransferChildChainNavigator.router

export const AppNavigator = Home(
  TransferRootChainNavigator,
  TransferChildChainNavigator
)

export const WarpPortalNavigator = WarpPortal
