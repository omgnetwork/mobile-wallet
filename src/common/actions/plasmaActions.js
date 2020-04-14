import { createAsyncAction } from './actionCreators'
import { plasmaService } from 'common/services'
import { Parser } from 'common/blockchain'
import { TransactionActionTypes, TransactionTypes, Gas } from 'common/constants'
import { Datetime } from 'common/utils'

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

export const deposit = (blockchainWallet, token, gasPrice) => {
  const asyncAction = async () => {
    const { hash, gasUsed } = await plasmaService.deposit(
      blockchainWallet.address,
      blockchainWallet.privateKey,
      token,
      gasPrice
    )

    return {
      hash,
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
    type: 'CHILDCHAIN/DEPOSIT',
    operation: asyncAction
  })
}

export const transfer = (blockchainWallet, toAddress, token, feeToken) => {
  const asyncAction = async () => {
    const { txhash } = await plasmaService.transfer(
      blockchainWallet,
      toAddress,
      token,
      feeToken
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
      gasToken: feeToken,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN,
      createdAt: Datetime.now()
    }
  }

  return createAsyncAction({
    type: 'CHILDCHAIN/SEND_TOKEN',
    operation: asyncAction
  })
}

export const mergeUTXOs = (
  address,
  privateKey,
  maximumUtxosPerCurrency,
  listOfUtxos,
  blknum,
  storeBlknum
) => {
  const asyncAction = async () => {
    if (listOfUtxos.length === 0) {
      return {
        address,
        blknum,
        actionType: TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
      }
    }

    const receipts = await plasmaService.mergeUTXOs(
      address,
      privateKey,
      maximumUtxosPerCurrency,
      listOfUtxos,
      storeBlknum
    )

    if (!receipts) return

    // Get highest blk num
    const { blknum: lastBlknum } = receipts.sort(
      (a, b) => b.blknum - a.blknum
    )[0]

    return {
      address,
      blknum: lastBlknum,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
    }
  }

  return createAsyncAction({
    type: 'CHILDCHAIN/MERGE_UTXOS',
    operation: asyncAction
  })
}

export const exit = (blockchainWallet, token, utxos, gasPrice) => {
  const asyncAction = async () => {
    const {
      hash,
      exitId,
      blknum,
      flatFee,
      exitableAt,
      to,
      gasUsed
    } = await plasmaService.exit(blockchainWallet, token, utxos, gasPrice)

    return {
      hash,
      from: blockchainWallet.address,
      to: to,
      value: token.balance,
      smallestValue: Parser.parseUnits(
        token.balance,
        token.tokenDecimal
      ).toString(),
      symbol: token.tokenSymbol,
      exitableAt,
      exitId: exitId,
      blknum,
      tokenDecimal: token.tokenDecimal,
      tokenPrice: token.price,
      contractAddress: token.contractAddress,
      flatFee,
      gasPrice,
      gasUsed,
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

export const getFees = tokens => {
  const asyncAction = async () => {
    const { fees, updatedAt } = await plasmaService.getFees(tokens)
    return {
      data: fees,
      updatedAt
    }
  }

  return createAsyncAction({
    type: 'CHILDCHAIN/FEES',
    operation: asyncAction
  })
}

export const processExits = (blockchainWallet, utxo, maxExitsToProcess) => {
  const asyncAction = async () => {
    const {
      symbol,
      contractAddress,
      exitId,
      value,
      smallestValue,
      tokenDecimal,
      tokenPrice
    } = utxo

    const gasOption = {
      gas: Gas.HIGH_LIMIT,
      gasPrice: Gas.EXIT_GAS_PRICE
    }
    const response = await plasmaService.processExits(
      blockchainWallet,
      contractAddress,
      maxExitsToProcess,
      gasOption
    )
    const { transactionHash, from, to, gasUsed } = response

    return {
      hash: transactionHash,
      from,
      to,
      symbol,
      exitId,
      tokenDecimal,
      tokenPrice,
      value,
      smallestValue,
      contractAddress,
      gasPrice: gasOption.gasPrice,
      gasUsed,
      maxExitsToProcess,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_PROCESS_EXIT,
      type: TransactionTypes.TYPE_PROCESS_EXIT,
      createdAt: Datetime.now(),
      timestamp: Datetime.timestamp()
    }
  }

  return createAsyncAction({
    type: 'CHILDCHAIN/PROCESS_EXIT',
    operation: asyncAction
  })
}
