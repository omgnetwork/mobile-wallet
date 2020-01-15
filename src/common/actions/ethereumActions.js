import { ethereumService } from '../services'
import { createAsyncAction } from './actionCreators'
import { TransactionActionTypes } from 'common/constants'
import { Datetime } from 'common/utils'

export const sendErc20Token = (token, fee, blockchainWallet, toAddress) => {
  const asyncAction = async () => {
    const options = { token, fee, toAddress }

    const {
      hash,
      from,
      nonce,
      gasPrice
    } = await ethereumService.sendErc20Token(blockchainWallet, options)

    return {
      hash: hash,
      from: from,
      to: toAddress,
      nonce: nonce,
      value: token.balance,
      actionType: TransactionActionTypes.TYPE_ROOTCHAIN_SEND_TOKEN,
      symbol: token.tokenSymbol,
      gasPrice: gasPrice.toString(),
      createdAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'ROOTCHAIN/SEND_ERC20_TOKEN',
    operation: asyncAction
  })
}

export const sendEthToken = (token, fee, blockchainWallet, toAddress) => {
  const asyncAction = async () => {
    const options = {
      token,
      fee,
      toAddress
    }

    const { hash, from, nonce, gasPrice } = await ethereumService.sendEthToken(
      blockchainWallet,
      options
    )

    return {
      hash: hash,
      from: from,
      to: toAddress,
      nonce: nonce,
      value: token.balance,
      actionType: TransactionActionTypes.TYPE_ROOTCHAIN_SEND_TOKEN,
      symbol: token.tokenSymbol,
      gasUsed: null,
      gasPrice: gasPrice.toString(),
      createdAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'ROOTCHAIN/SEND_ETH_TOKEN',
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
