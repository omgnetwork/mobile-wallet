import { createAsyncAction } from './actionCreators'
import { plasmaService } from 'common/services'
import { TransactionActionTypes, TransactionTypes } from 'common/constants'
import { Datetime, Parser } from 'common/utils'

export const fetchAssets = (provider, address) => {
  const asyncAction = async () => {
    const {
      childchainAssets,
      fromUtxoPos,
      updatedAt
    } = await plasmaService.fetchAssets(provider, address)
    return {
      address,
      childchainAssets,
      fromUtxoPos,
      updatedAt
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/FETCH_ASSETS',
    operation: asyncAction
  })
}

export const depositEth = (blockchainWallet, token) => {
  const asyncAction = async () => {
    const {
      transactionHash,
      gasPrice,
      gasUsed
    } = await plasmaService.depositEth(
      blockchainWallet.address,
      blockchainWallet.privateKey,
      token.balance
    )

    return {
      hash: transactionHash,
      from: blockchainWallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      tokenDecimal: token.tokenDecimal,
      contractAddress: token.contractAddress,
      gasPrice: gasPrice,
      gasUsed: gasUsed,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT,
      createdAt: Datetime.now()
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/DEPOSIT_ETH_TOKEN',
    operation: asyncAction
  })
}

export const depositErc20 = (blockchainWallet, token) => {
  const asyncAction = async () => {
    const {
      transactionHash,
      gasPrice,
      gasUsed
    } = await plasmaService.depositErc20(
      blockchainWallet.address,
      blockchainWallet.privateKey,
      token
    )

    return {
      hash: transactionHash,
      from: blockchainWallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      tokenDecimal: token.tokenDecimal,
      contractAddress: token.contractAddress,
      gasPrice: gasPrice,
      gasUsed: gasUsed,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT,
      createdAt: Datetime.now()
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/DEPOSIT_ERC20_TOKEN',
    operation: asyncAction
  })
}

export const transfer = (blockchainWallet, toAddress, token) => {
  const asyncAction = async () => {
    const { txhash } = await plasmaService.transfer(
      blockchainWallet,
      toAddress,
      token
    )

    return {
      hash: txhash,
      from: blockchainWallet.address,
      value: token.balance,
      symbol: token.tokenSymbol,
      tokenDecimal: token.tokenDecimal,
      contractAddress: token.contractAddress,
      gasUsed: 1,
      gasPrice: 1,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN,
      createdAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'CHILDCHAIN/SEND_TOKEN',
    operation: asyncAction
  })
}

export const exit = (blockchainWallet, token) => {
  const asyncAction = async () => {
    const {
      transactionHash,
      exitId,
      blknum,
      flatFee,
      paymentExitGameAddress,
      gasPrice
    } = await plasmaService.exit(blockchainWallet, token)

    return {
      hash: transactionHash,
      from: blockchainWallet.address,
      to: paymentExitGameAddress,
      value: token.balance,
      smallestValue: Parser.parseUnits(
        token.balance,
        token.tokenDecimal
      ).toString(),
      symbol: token.tokenSymbol,
      exitId: exitId,
      childchainBlockNumber: blknum,
      tokenDecimal: token.tokenDecimal,
      contractAddress: token.contractAddress,
      flatFee,
      gasPrice,
      gasUsed: 1,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_EXIT,
      type: TransactionTypes.TYPE_EXIT,
      createdAt: Datetime.now(),
      timestamp: Datetime.timestamp()
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/EXIT',
    operation: asyncAction
  })
}

// We're not using this right now but let's keep it because it still has potential to be used in the future.
// export const processExits = (blockchainWallet, transaction) => {
//   const asyncAction = async () => {
//     const { value, symbol, contractAddress, gasPrice, exitId } = transaction
//     const { transactionHash } = await plasmaService.processExits(
//       blockchainWallet,
//       exitId,
//       contractAddress
//     )
//     return {
//       hash: transactionHash,
//       from: blockchainWallet.address,
//       value,
//       symbol,
//       contractAddress,
//       gasPrice,
//       actionType: TransactionActionTypes.TYPE_CHILDCHAIN_PROCESS_EXIT,
//       createdAt: Datetime.now()
//     }
//   }

//   return createAsyncAction({
//     type: 'CHILDCHAIN/PROCESS_EXIT',
//     operation: asyncAction,
//     isBackgroundTask: true
//   })
// }
