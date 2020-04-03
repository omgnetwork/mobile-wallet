import { Datetime, Mapper } from 'common/utils'
import {
  BlockchainFormatter,
  Plasma,
  Token,
  Parser,
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

export const getTxs = (address, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transactions = await Transaction.all(address, options)
      const currentWatcherTxs = transactions.map(tx => ({
        ...tx,
        hash: tx.txhash
      }))
      resolve(currentWatcherTxs)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

export const getTx = hash => {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = await Transaction.get(hash)
      resolve({
        hash: transaction.txhash,
        ...transaction
      })
    } catch (err) {
      reject(err)
    }
  })
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
    const currencies = tokens.map(token => token.contractAddress)
    const fees = await Plasma.getFees(currencies).then(feeTokens => {
      return feeTokens.map(feeToken => {
        const token = tokens.find(t => t.contractAddress === feeToken.currency)
        return {
          ...feeToken,
          ...token
        }
      })
    })
    return { fees, updatedAt: fees[0] ? fees[0].updated_at : null }
  } catch (err) {
    throw err
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
  const weiAmount = Parser.parseUnits(
    token.balance,
    token.tokenDecimal
  ).toString(10)

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

export const exit = (blockchainWallet, token, utxos, gasPrice) => {
  return new Promise(async (resolve, reject) => {
    try {
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

      const {
        scheduledFinalizationTime: exitableAt
      } = await Plasma.getExitTime(startedExitBlkNum, utxoToExit.blknum)

      resolve({
        hash,
        exitId,
        exitableAt,
        blknum: utxoToExit.blknum,
        to: Config.PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS,
        flatFee: standardExitBond,
        gasPrice,
        gasUsed
      })
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
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

const getOrCreateUtxoWithAmount = async (
  desiredAmount,
  blockchainWallet,
  token,
  fee
) => {
  return (
    (await getUtxoByAmount(desiredAmount, blockchainWallet, token)) ||
    (await createUtxoWithAmount(desiredAmount, blockchainWallet, token, fee))
  )
}

export const createUtxoWithAmount = async (
  desiredAmount,
  blockchainWallet,
  token
) => {
  const { utxo_pos: latestUtxoPos } = await Utxos.get(
    blockchainWallet.address,
    {
      currency: token.contractAddress
    }
  ).then(utxos => utxos[0])

  await transfer(blockchainWallet, blockchainWallet.address, token)

  // Wait for found matched UTXO after merge or split.
  const selectedUtxo = await Wait.waitForChildChainUtxoAmount(
    desiredAmount,
    latestUtxoPos,
    blockchainWallet,
    token
  )

  if (!selectedUtxo) return null

  return {
    ...selectedUtxo,
    amount: selectedUtxo.amount
  }
}

const getUtxoByAmount = async (amount, blockchainWallet, token) => {
  const utxos = await Utxos.get(blockchainWallet.address, {
    currency: token.contractAddress
  })

  return utxos.find(utxo => utxo.amount === amount)
}
