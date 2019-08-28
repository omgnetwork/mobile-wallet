import { createAction, createAsyncAction } from './actionCreators'
import {
  plasmaService,
  walletService,
  transactionService,
  notificationService
} from 'common/services'
import { Datetime } from 'common/utils'

export const fetchAssets = (rootchainAssets, address) => {
  const asyncAction = async () => {
    const assets = await plasmaService.fetchAssets(rootchainAssets, address)

    return { address, plasmaAssets: assets }
  }
  return createAsyncAction({
    type: 'PLASMA/LOAD_ASSETS',
    operation: asyncAction
  })
}

export const depositEth = (wallet, provider, token, fee) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(wallet.address, provider)

    const transactionReceipt = await plasmaService.depositEth(
      blockchainWallet.address,
      blockchainWallet.privateKey,
      token.balance,
      fee
    )

    return {
      hash: transactionReceipt.transactionHash,
      from: wallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      gasPrice: fee.amount,
      type: 'CHILDCHAIN_DEPOSIT',
      createdAt: Datetime.now()
    }
  }
  return createAsyncAction({
    type: 'PLASMA/DEPOSIT_ETH_TOKEN',
    operation: asyncAction
  })
}

export const waitDeposit = (provider, wallet, tx) => {
  const asyncAction = async () => {
    const txReceipt = await transactionService.subscribeTransaction(
      provider,
      tx,
      5
    )
    console.log(txReceipt)

    notificationService.sendNotification({
      title: `${wallet.name} deposited`,
      message: `${tx.value} ${tx.symbol}`
    })

    return {
      hash: tx.hash,
      from: tx.from,
      gasPrice: tx.gasPrice.toString()
    }
  }
  return createAsyncAction({
    type: 'PLASMA/WAIT_DEPOSITING',
    operation: asyncAction,
    isBackgroundTask: true
  })
}
