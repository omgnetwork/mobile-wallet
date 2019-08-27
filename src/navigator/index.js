import Home from './home'
import TransferChildChain from './transfer-childchain'
import TransferRootChain from './transfer-rootchain'
import WarpPortal from './warp-portal'
import * as Views from 'components/views'

Views.Transfer.router = TransferRootChain.router
Views.Deposit.router = TransferChildChain.router

export const AppNavigator = Home(TransferRootChain, TransferChildChain)
export const WarpPortalNavigator = WarpPortal
