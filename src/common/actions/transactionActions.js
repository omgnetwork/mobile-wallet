import {
  transactionService,
  walletService,
  notificationService
} from '../services'
import { createAsyncAction } from './actionCreators'
import { Datetime } from 'common/utils'

export const sendErc20Token = (token, fromWallet, provider, toAddress) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(
      fromWallet.address,
      provider
    )
    const tx = await transactionService.sendErc20Token(
      token,
      blockchainWallet,
      toAddress
    )

    return {
      hash: tx.hash,
      from: tx.from,
      nonce: tx.nonce,
      gasPrice: tx.gasPrice.toString(),
      createdAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'TRANSACTION/SEND_ERC20_TOKEN',
    operation: asyncAction
  })
}

export const sendEthToken = (token, fromWallet, provider, toAddress) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(
      fromWallet.address,
      provider
    )
    const tx = await transactionService.sendEthToken(
      token,
      blockchainWallet,
      toAddress
    )

    return {
      hash: tx.hash,
      from: tx.from,
      nonce: tx.nonce,
      value: token.balance,
      symbol: token.tokenSymbol,
      gasPrice: tx.gasPrice.toString()
    }
  }

  return createAsyncAction({
    type: 'TRANSACTION/SEND_ETH_TOKEN',
    operation: asyncAction
  })
}

export const waitForTransaction = (provider, wallet, tx) => {
  const asyncAction = async () => {
    const txReceipt = await transactionService.waitForTransaction(provider, tx)

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
    type: 'TRANSACTION/WAIT_RECEIPT',
    operation: asyncAction,
    isBackgroundTask: true
  })
}
