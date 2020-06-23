import { ethereumService } from '../services'
import { createAsyncAction } from './actionCreators'
import { TransactionActionTypes, ContractAddress } from 'common/constants'
import { Datetime } from 'common/utils'

export const transfer = sendTransactionParams => {
  const asyncAction = async () => {
    const { from, to } = sendTransactionParams.addresses
    const { token } = sendTransactionParams.smallestUnitAmount
    const { gas, gasPrice } = sendTransactionParams.gasOptions

    const { hash, value } =
      token.contractAddress === ContractAddress.ETH_ADDRESS
        ? await ethereumService.sendEthToken(sendTransactionParams)
        : await ethereumService.sendErc20Token(sendTransactionParams)

    return {
      hash,
      from,
      to,
      value,
      actionType: TransactionActionTypes.TYPE_ROOTCHAIN_SEND_TOKEN,
      symbol: token.tokenSymbol,
      gasUsed: gas,
      gasPrice,
      createdAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'ROOTCHAIN/SEND_TOKEN',
    operation: asyncAction
  })
}

export const getRecommendedGas = () => {
  const asyncAction = async () => {
    return await ethereumService.getRecommendedGas()
  }

  return createAsyncAction({
    type: 'ROOTCHAIN/GET_RECOMMENDED_GAS',
    operation: asyncAction
  })
}

export const fetchAssets = (provider, address, lastBlockNumber) => {
  const asyncAction = async () => {
    const updatedAssets = await ethereumService.fetchAssets(
      provider,
      address,
      lastBlockNumber
    )

    return updatedAssets
  }

  return createAsyncAction({
    type: 'ROOTCHAIN/FETCH_ASSETS',
    operation: asyncAction
  })
}
