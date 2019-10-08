import { createAsyncAction } from './actionCreators'
import { plasmaService, walletService } from 'common/services'
import { Datetime } from 'common/utils'

export const fetchAssets = (rootchainAssets, address) => {
  const asyncAction = async () => {
    const result = await plasmaService.fetchAssets(rootchainAssets, address)
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

export const depositEth = (blockchainWallet, token, fee) => {
  const asyncAction = async () => {
    const transactionReceipt = await plasmaService.depositEth(
      blockchainWallet.address,
      blockchainWallet.privateKey,
      token.balance,
      fee
    )

    return {
      hash: transactionReceipt.transactionHash,
      from: blockchainWallet.address,
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

export const transfer = (blockchainWallet, toAddress, token, fee) => {
  const asyncAction = async () => {
    const transactionReceipt = await plasmaService.transfer(
      blockchainWallet,
      toAddress,
      token,
      fee
    )

    return {
      hash: transactionReceipt.txhash,
      from: blockchainWallet.address,
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

export const depositErc20 = (blockchainWallet, token, fee) => {
  const asyncAction = async () => {
    const transactionReceipt = await plasmaService.depositErc20(
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

export const exit = (blockchainWallet, token, fee) => {
  const asyncAction = async () => {
    const exitReceipt = await plasmaService.exit(blockchainWallet, token, fee)

    return {
      hash: exitReceipt.transactionHash,
      from: blockchainWallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      exitId: exitReceipt.exitId,
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

export const processExits = (blockchainWallet, token, fee) => {
  const asyncAction = async () => {
    const exitReceipt = await plasmaService.processExits(
      blockchainWallet,
      0,
      token
    )
    return {
      hash: exitReceipt.transactionHash,
      from: blockchainWallet.address,
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
