import { createAsyncAction } from './actionCreators'
import {
  childchainService,
  walletService,
  rootchainService,
  notificationService
} from 'common/services'
import { Datetime } from 'common/utils'

export const fetchAssets = (rootchainAssets, address) => {
  const asyncAction = async () => {
    const result = await childchainService.fetchAssets(rootchainAssets, address)
    return {
      address,
      childchainAssets: result.childchainAssets,
      lastUtxoPos: result.lastUtxoPos
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/LOAD_ASSETS',
    operation: asyncAction
  })
}

export const invalidatePendingTx = (pendingTxs, address) => {
  const asyncAction = async () => {
    const resolvedTxs = await childchainService.getResolvedPendingTxs(
      pendingTxs,
      address
    )

    return { resolvedPendingTxs: resolvedTxs }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/INVALIDATE_PENDING_TXS',
    operation: asyncAction,
    isBackgroundTask: true
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
      contractAddress: token.contractAddress,
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

    console.log(transactionReceipt)

    return {
      hash: transactionReceipt.txhash,
      from: fromWallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      contractAddress: token.contractAddress,
      gasPrice: fee.amount,
      type: 'CHILDCHAIN_SEND_TOKEN',
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
      contractAddress: token.contractAddress,
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

export const waitDeposit = (wallet, tx) => {
  const asyncAction = async () => {
    await childchainService.waitUntilFoundNewUTXO(wallet.lastUtxoPos, {
      lastUtxoPos: wallet.lastUtxoPos,
      currency: tx.contractAddress
    })

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

export const waitExit = (provider, wallet, tx) => {
  const asyncAction = async () => {
    const txReceipt = await rootchainService.subscribeTransaction(
      provider,
      tx,
      12
    )

    notificationService.sendNotification({
      title: `${wallet.name} exit is now taking off!`,
      message: `${tx.value} ${tx.symbol}`
    })

    return {
      hash: tx.hash,
      from: tx.from,
      gasPrice: tx.gasPrice.toString()
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/WAIT_EXITING',
    operation: asyncAction,
    isBackgroundTask: true
  })
}

export const exit = (wallet, provider, token, fee) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(wallet.address, provider)
    const exitReceipt = await childchainService.exit(
      blockchainWallet,
      token,
      fee
    )

    return {
      hash: exitReceipt.transactionHash,
      from: wallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      contractAddress: token.contractAddress,
      gasPrice: fee.amount,
      type: 'CHILDCHAIN_EXIT',
      createdAt: Datetime.now()
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/EXIT',
    operation: asyncAction
  })
}

export const processExits = (wallet, provider, token, fee) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(wallet.address, provider)
    const exitReceipt = await childchainService.processExits(
      blockchainWallet,
      token,
      fee
    )
    return {
      hash: exitReceipt.transactionHash,
      from: wallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      contractAddress: token.contractAddress,
      gasPrice: fee.amount,
      type: 'CHILDCHAIN_PROCESS_EXIT',
      createdAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'CHILDCHAIN/PROCESS_EXIT',
    operation: asyncAction
  })
}

export const waitWatcherRecordTransaction = (wallet, tx) => {
  const asyncAction = async () => {
    console.log(tx)
    await childchainService.waitUntilFoundNewUTXO(wallet.address, {
      lastUtxoPos: wallet.lastUtxoPos,
      currency: tx.contractAddress
    })

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
