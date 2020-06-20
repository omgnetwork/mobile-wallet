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
import { ContractAddress } from 'common/constants'

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
  storeBlknum
) => {
  return Plasma.mergeListOfUtxos(
    address,
    privateKey,
    maximumUtxosPerCurrency,
    listOfUtxos,
    storeBlknum
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

export const transfer = async (
  fromBlockchainWallet,
  toAddress,
  token,
  fee = { contractAddress: ContractAddress.ETH_ADDRESS, amount: 1 },
  metadata
) => {
  try {
    const receipt = await Plasma.transfer(
      fromBlockchainWallet,
      toAddress,
      token,
      fee,
      metadata
    )

    return receipt
  } catch (err) {
    if (err.message === 'submit:client_error') {
      throw new Error('Something went wrong on the childchain')
    } else {
      throw err
    }
  }
}

export const deposit = async (address, privateKey, token, gasPrice) => {
  const weiAmount = Unit.convertToString(token.balance, 0, token.tokenDecimal)

  const { hash, gasUsed } = await Plasma.deposit(
    address,
    privateKey,
    weiAmount,
    token.contractAddress,
    {
      gasPrice
    }
  )
  return {
    hash,
    gasPrice,
    gasUsed
  }
}

export const exit = async (blockchainWallet, token, utxos, gasPrice) => {
  const hasExitQueue = await Token.hasExitQueue(token.contractAddress)
  const { address, privateKey } = blockchainWallet
  if (!hasExitQueue) {
    await Token.createExitQueue(token.contractAddress, {
      from: address,
      privateKey,
      gasPrice
    })
  }

  let utxoToExit
  if (utxos.length === 1) {
    utxoToExit = utxos[0]
  } else {
    const { blknum } = await Utxos.merge(address, privateKey, utxos)
    await Wait.waitChildChainBlknum(address, blknum)
    utxoToExit = await Utxos.get(address, {
      currency: token.contractAddress
    }).then(latestUtxos => latestUtxos.find(utxo => utxo.blknum === blknum))
  }

  const exitData = await Plasma.getExitData(utxoToExit)

  const {
    transactionHash: hash,
    blockNumber: startedExitBlkNum,
    gasUsed
  } = await Plasma.standardExit(exitData, blockchainWallet, { gasPrice })
  const exitId = await Plasma.getStandardExitId(utxoToExit, exitData)
  const standardExitBond = await Plasma.getStandardExitBond()

  console.log('standard exit hash', hash)
  await Wait.waitForRootchainTransaction({
    hash,
    intervalMs: 1000,
    confirmationThreshold: 1
  })

  const { scheduledFinalizationTime: exitableAt } = await Plasma.getExitTime(
    startedExitBlkNum,
    utxoToExit.blknum
  )

  return {
    hash,
    exitId,
    exitableAt,
    blknum: utxoToExit.blknum,
    to: Config.PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS,
    flatFee: standardExitBond,
    gasPrice,
    gasUsed
  }
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
