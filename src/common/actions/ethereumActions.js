import { ethereumService } from '../services'
import { createAsyncAction } from './actionCreators'
import { TransactionActionTypes, ContractAddress } from 'common/constants'
import { Datetime } from 'common/utils'

export const transfer = (blockchainWallet, toAddress, token, fee) => {
  const asyncAction = async () => {
    const options = {
      token,
      fee,
      toAddress
    }
    const { hash } =
      token.contractAddress === ContractAddress.ETH_ADDRESS
        ? await ethereumService.sendEthToken(blockchainWallet, options)
        : await ethereumService.sendErc20Token(blockchainWallet, options)

    return {
      hash,
      from: blockchainWallet.address,
      to: toAddress,
      value: token.balance,
      actionType: TransactionActionTypes.TYPE_ROOTCHAIN_SEND_TOKEN,
      symbol: token.tokenSymbol,
      gasUsed: null,
      gasPrice: fee.amount,
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
