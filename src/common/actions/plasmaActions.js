import { createAsyncAction } from './actionCreators'
import { plasmaService } from 'common/services'
import { TransactionActionTypes, TransactionTypes, Gas } from 'common/constants'
import { Datetime, Unit } from 'common/utils'

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

export const deposit = sendTransactionParams => {
  const asyncAction = async () => {
    const { from, to } = sendTransactionParams.addresses
    const { token } = sendTransactionParams.smallestUnitAmount
    const { gas, gasPrice } = sendTransactionParams.gasOptions

    const { hash, value } = await plasmaService.deposit(sendTransactionParams)

    return {
      hash,
      from,
      to,
      value,
      symbol: token.tokenSymbol,
      tokenDecimal: token.tokenDecimal,
      contractAddress: token.contractAddress,
      gasPrice,
      gasUsed: gas,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_DEPOSIT,
      createdAt: Datetime.now()
    }
  }
  return createAsyncAction({
    type: 'CHILDCHAIN/DEPOSIT',
    operation: asyncAction
  })
}

export const transfer = sendTransactionParams => {
  const asyncAction = async () => {
    const { addresses, smallestUnitAmount, gasOptions } = sendTransactionParams
    const { gasPrice, gasToken } = gasOptions
    const { from, to } = addresses
    const { token } = smallestUnitAmount

    const { hash, value } = await plasmaService.transfer(sendTransactionParams)

    return {
      hash,
      from,
      to,
      value,
      symbol: token.tokenSymbol,
      tokenDecimal: token.tokenDecimal,
      contractAddress: token.contractAddress,
      gasUsed: 1,
      gasPrice,
      gasToken,
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
  updateBlknumCallback
) => {
  const asyncAction = async () => {
    await plasmaService.mergeUTXOs(
      address,
      privateKey,
      maximumUtxosPerCurrency,
      listOfUtxos,
      updateBlknumCallback
    )

    return {
      address,
      actionType: TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
    }
  }

  return createAsyncAction({
    type: 'CHILDCHAIN/MERGE_UTXOS',
    operation: asyncAction
  })
}

export const exit = sendTransactionParams => {
  const asyncAction = async () => {
    const { from, to } = sendTransactionParams.addresses
    const { gas, gasPrice } = sendTransactionParams.gasOptions
    const { token, amount } = sendTransactionParams.smallestUnitAmount

    const { hash, exitId, blknum, value, flatFee } = await plasmaService.exit(
      sendTransactionParams
    )

    return {
      hash,
      from,
      to,
      value,
      smallestValue: amount,
      symbol: token.tokenSymbol,
      exitId: exitId,
      blknum,
      tokenDecimal: token.dispatchGetFeestokenDecimal,
      tokenPrice: token.price,
      contractAddress: token.contractAddress,
      flatFee,
      gasPrice,
      gasUsed: gas,
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
    const { available, updatedAt, all } = await plasmaService.getFees(tokens)
    return {
      available,
      all,
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
