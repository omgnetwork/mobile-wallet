import { createAsyncAction } from './actionCreators'
import {
  childchainService,
  walletService,
  transactionService,
  notificationService
} from 'common/services'
import { Datetime } from 'common/utils'
import Config from 'react-native-config'

export const fetchAssets = (rootchainAssets, address) => {
  const asyncAction = async () => {
    const assets = await childchainService.fetchAssets(rootchainAssets, address)
    return { address, childchainAssets: assets }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/LOAD_ASSETS',
    operation: asyncAction
  })
}

export const depositEth = (wallet, provider, token, fee) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(wallet.address, provider)

    const transactionReceipt = await childchainService.depositEth(
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
    type: 'CHILDCHAIN/DEPOSIT_ETH_TOKEN',
    operation: asyncAction
  })
}

export const transfer = (provider, fromWallet, toAddress, token, fee) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(
      fromWallet.address,
      provider
    )

    const transactionReceipt = await childchainService.transfer(
      blockchainWallet,
      toAddress,
      token,
      fee
    )

    return {
      hash: transactionReceipt.transactionHash,
      from: fromWallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      gasPrice: fee.amount,
      type: 'CHILDCHAIN_SEND',
      createdAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'CHILDCHAIN/SEND_TOKEN',
    operation: asyncAction
  })
}

export const depositErc20 = (wallet, provider, token, fee) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(wallet.address, provider)

    const transactionReceipt = await childchainService.depositErc20(
      blockchainWallet.address,
      blockchainWallet.privateKey,
      token,
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
    type: 'CHILDCHAIN/DEPOSIT_ERC20_TOKEN',
    operation: asyncAction
  })
}

export const waitDeposit = (provider, wallet, tx) => {
  const asyncAction = async () => {
    const txReceipt = await transactionService.subscribeTransaction(
      provider,
      tx,
      Config.CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS
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
    type: 'CHILDCHAIN/WAIT_DEPOSITING',
    operation: asyncAction,
    isBackgroundTask: true
  })
}

export const waitWatcherRecordTransaction = (provider, wallet, tx) => {
  const asyncAction = async () => {
    await childchainService.wait(40000)

    notificationService.sendNotification({
      title: `${wallet.name} sent`,
      message: `${tx.value} ${tx.symbol}`
    })

    return {
      hash: tx.hash,
      from: tx.from,
      gasPrice: tx.gasPrice.toString()
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/WAIT_SENDING',
    operation: asyncAction,
    isBackgroundTask: true
  })
}
