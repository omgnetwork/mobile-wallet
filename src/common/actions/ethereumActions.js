import {
  ethereumService,
  walletService,
  notificationService
} from '../services'
import { createAsyncAction } from './actionCreators'
import { Datetime } from 'common/utils'
import Config from 'react-native-config'

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

export const subscribeTransaction = (provider, wallet, tx) => {
  const asyncAction = async () => {
    const txReceipt = await ethereumService.subscribeTransaction(
      provider,
      tx,
      Config.ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS
    )

    console.log(txReceipt)
    notificationService.sendNotification({
      title: `${wallet.name} sent`,
      message: `${tx.value} ${tx.symbol}`
    })

    return {
      hash: tx.hash,
      from: tx.from,
      nonce: tx.nonce,
      gasPrice: tx.gasPrice.toString()
    }
  }

  return createAsyncAction({
    type: 'ROOTCHAIN/WAIT_SENDING',
    operation: asyncAction,
    isBackgroundTask: true
  })
}
