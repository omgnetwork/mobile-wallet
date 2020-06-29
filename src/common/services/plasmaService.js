import { Datetime, Mapper, Unit } from 'common/utils'
import {
  BlockchainFormatter,
  Plasma,
  Token,
  Wait,
  Transaction,
  Utxos
} from 'common/blockchain'
import Config from 'react-native-config'

export const fetchAssets = async (provider, address) => {
  try {
    const [balances, utxos] = await Promise.all([
      Plasma.getBalances(address),
      Utxos.get(address)
    ])

    const tokenContractAddresses = getTokenContractAddresses(balances)
    const tokenMap = await Token.all(provider, tokenContractAddresses, address)
    const childchainAssets = balances.map(balance => {
      const token = tokenMap[balance.currency]
      return {
        ...token,
        contractAddress: balance.currency,
        balance: BlockchainFormatter.formatUnits(
          balance.amount,
          token.tokenDecimal
        )
      }
    })

    return {
      fromUtxoPos: getUtxoPos(utxos),
      childchainAssets,
      updatedAt: Datetime.now()
    }
  } catch (err) {
    throw new Error(
      `Unable to fetch the childchain assets for address ${address}.`
    )
  }
}

const getTokenContractAddresses = balances => {
  const currencies = balances.map(Mapper.mapAssetCurrency)
  return Array.from(new Set(currencies))
}

const getUtxoPos = utxos =>
  (utxos.length && utxos[0].utxo_pos.toString(10)) || '0'

export const getTxs = async (address, options) => {
  try {
    const transactions = await Transaction.all(address, options)
    return transactions.map(tx => ({
      ...tx,
      hash: tx.txhash
    }))
  } catch (err) {
    throw new Error(err)
  }
}

export const getTx = async hash => {
  const transaction = await Transaction.get(hash)
  return {
    hash: transaction.txhash,
    ...transaction
  }
}

export const mergeUTXOs = (
  address,
  privateKey,
  maximumUtxosPerCurrency,
  listOfUtxos,
  updateBlknumCallback
) => {
  return Plasma.mergeListOfUtxos(
    address,
    privateKey,
    maximumUtxosPerCurrency,
    listOfUtxos,
    updateBlknumCallback
  )
}

export const getFees = async tokens => {
  try {
    const all = await Plasma.getFees()
    const available = all.flatMap(fee => {
      const token = tokens.find(t => t.contractAddress === fee.currency)
      return token ? [{ ...fee, ...token }] : []
    })

    return {
      available,
      all,
      updatedAt: all[0] ? all[0].updated_at : null
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const transfer = async sendTransactionParams => {
  const { token, amount } = sendTransactionParams.smallestUnitAmount
  const { txhash } = await Plasma.transfer({
    ...sendTransactionParams,
    smallestUnitAmount: {
      ...sendTransactionParams.smallestUnitAmount,
      amount: Unit.convertToString(
        amount,
        token.tokenDecimal,
        token.tokenDecimal,
        16
      )
    }
  })

  return {
    hash: txhash,
    value: Unit.convertToString(amount, token.tokenDecimal, 0)
  }
}

export const deposit = async sendTransactionParams => {
  const { token, amount } = sendTransactionParams.smallestUnitAmount
  const { hash } = await Plasma.deposit(sendTransactionParams)

  return {
    hash,
    value: Unit.convertToString(amount, token.tokenDecimal, 0)
  }
}

export const hasExitQueue = sendTransactionParams =>
  Token.hasExitQueue(sendTransactionParams)

export const createExitQueue = sendTransactionParams =>
  Token.createExitQueue(sendTransactionParams)

export const exit = async (blockchainWallet, token, utxos, gasPrice) => {
  return Plasma.exit(blockchainWallet, token, utxos, gasPrice)
}

export const processExits = (
  blockchainWallet,
  contractAddress,
  maxExitsToProcess,
  gasOption
) => {
  return Plasma.processExits(contractAddress, maxExitsToProcess, {
    ...gasOption,
    from: blockchainWallet.address,
    privateKey: blockchainWallet.privateKey
  })
}
