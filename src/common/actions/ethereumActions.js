import { ethereumService } from '../services'
import { createAsyncAction } from './actionCreators'
import { Datetime } from 'common/utils'

export const sendErc20Token = (token, fee, blockchainWallet, toAddress) => {
  const asyncAction = async () => {
    const options = { token, fee, toAddress }

    const tx = await ethereumService.sendErc20Token(blockchainWallet, options)

    return {
      hash: tx.hash,
      from: tx.from,
      nonce: tx.nonce,
      value: token.balance,
      type: 'ROOTCHAIN_SEND',
      symbol: token.tokenSymbol,
      gasPrice: tx.gasPrice.toString(),
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

    const receipt = await ethereumService.sendEthToken(
      blockchainWallet,
      options
    )

    console.log(receipt)

    return {
      hash: receipt.hash,
      from: receipt.from,
      nonce: receipt.nonce,
      value: token.balance,
      type: 'ROOTCHAIN_SEND',
      symbol: token.tokenSymbol,
      gasUsed: null,
      gasPrice: receipt.gasPrice.toString(),
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
