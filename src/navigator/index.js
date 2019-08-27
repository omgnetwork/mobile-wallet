import Home from './home'
import TransferChildChain from './transfer-childchain'
import TransferRootChain from './transfer-rootchain'
import * as Views from 'components/views'

Views.Transfer.router = TransferRootChain.router
Views.Deposit.router = TransferChildChain.router

export default Home(TransferRootChain, TransferChildChain)
