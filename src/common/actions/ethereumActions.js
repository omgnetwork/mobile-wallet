import { ethereumService, walletService } from '../services'
import { createAsyncAction } from './actionCreators'
import { Datetime } from 'common/utils'

export const sendErc20Token = (token, fee, fromWallet, provider, toAddress) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(
      fromWallet.address,
      provider
    )
    const tx = await ethereumService.sendErc20Token(
      token,
      fee,
      blockchainWallet,
      toAddress
    )

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

export const sendEthToken = (token, fee, fromWallet, provider, toAddress) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(
      fromWallet.address,
      provider
    )

    const tx = await ethereumService.sendEthToken(
      token,
      fee,
      blockchainWallet,
      toAddress
    )

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
    type: 'ROOTCHAIN/SEND_ETH_TOKEN',
    operation: asyncAction
  })
}
