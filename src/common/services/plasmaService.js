import { Formatter, Parser, Polling, Datetime, Mapper } from 'common/utils'
import { Plasma, Token } from 'common/blockchain'
import { ContractAddress } from 'common/constants'
import Config from 'react-native-config'
import { Wait } from 'common/utils'

export const fetchAssets = async (provider, address) => {
  try {
    const [balances, utxos] = await Promise.all([
      Plasma.getBalances(address),
      Plasma.getUtxos(address)
    ])

    const tokenContractAddresses = getTokenContractAddresses(balances)
    const tokenMap = await Token.fetchTokens(
      provider,
      tokenContractAddresses,
      address
    )
    const childchainAssets = balances.map(balance => {
      const token = tokenMap[balance.currency]
      return {
        ...token,
        contractAddress: balance.currency,
        balance: Formatter.formatUnits(balance.amount, token.tokenDecimal)
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
      const transactions = await Plasma.getTxs(address, options)
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
      const transaction = await Plasma.getTx(hash)
      resolve({
        hash: transaction.txhash,
        ...transaction
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const mergeUTXOsIfNeeded = async (address, privateKey, threshold) => {
  const listOfUtxos = await Plasma.getRequiredMergeUtxos(address, 4)
  console.log('need to merge?', listOfUtxos.length > 0)
  if (listOfUtxos.length > 0) {
    const receipts = await Plasma.mergeListOfUtxos(
      address,
      privateKey,
      threshold,
      listOfUtxos
    )
    return receipts
  }
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

export const transfer = (
  fromBlockchainWallet,
  toAddress,
  token,
  feeToken,
  metadata
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const feeCurrency =
        feeToken?.contractAddress ?? ContractAddress.ETH_ADDRESS
      const payments = Plasma.createPayment(
        toAddress,
        token.contractAddress,
        Parser.parseUnits(token.balance, token.tokenDecimal).toString(10)
      )
      const childchainFee = Plasma.createFee(feeCurrency)
      const createdTransactions = await Plasma.createTx(
        fromBlockchainWallet.address,
        payments,
        childchainFee,
        metadata
      )

      const transaction = createdTransactions.transactions[0]
      const typedData = Plasma.getTypedData(transaction)
      const privateKeys = new Array(transaction.inputs.length).fill(
        fromBlockchainWallet.privateKey
      )
      const signatures = Plasma.signTx(typedData, privateKeys)
      const signedTransaction = Plasma.buildSignedTx(typedData, signatures)
      const transactionReceipt = await Plasma.submitTx(signedTransaction)
      resolve(transactionReceipt)
    } catch (err) {
      console.log(err)
      if (err.message === 'submit:client_error') {
        reject(new Error('Something went wrong on the childchain'))
      } else {
        reject(err)
      }
    }
  })
}

export const deposit = (address, privateKey, token, gasPrice) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      resolve({
        hash,
        gasPrice,
        gasUsed
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const exit = (blockchainWallet, token, gasPrice) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the token has been unlocked
      const hasToken = await Plasma.hasToken(token.contractAddress)

      if (!hasToken) {
        await Plasma.addToken(token.contractAddress, {
          from: blockchainWallet.address,
          privateKey: blockchainWallet.privateKey,
          gasPrice
        })
      }

      const desiredAmount = Parser.parseUnits(
        token.balance,
        token.tokenDecimal
      ).toString(10)

      // For now `getUtxos` includes exited utxos, so after this issue https://github.com/omisego/elixir-omg/issues/1151 has been solved,
      // we can then  uncomment the function below to reduce unnecessary api call.
      // const utxoToExit = await getOrCreateUtxoWithAmount(
      //   desiredAmount,
      //   blockchainWallet,
      //   token
      // )

      const utxoToExit = await createUtxoWithAmount(
        desiredAmount,
        blockchainWallet,
        token
      )
      const acceptableUtxoParams = Plasma.createAcceptableUtxoParams(utxoToExit)
      const exitData = await Plasma.getExitData(acceptableUtxoParams)

      const {
        transactionHash: hash,
        blockNumber: startedExitBlkNum,
        gasUsed
      } = await Plasma.standardExit(exitData, blockchainWallet, { gasPrice })
      const exitId = await Plasma.getStandardExitId(utxoToExit, exitData)
      const standardExitBond = await Plasma.getStandardExitBond()

      await Wait.waitFor(5000)

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
  const { utxo_pos: latestUtxoPos } = await Plasma.getUtxos(
    blockchainWallet.address,
    {
      currency: token.contractAddress
    }
  ).then(utxos => utxos[0])

  await transfer(blockchainWallet, blockchainWallet.address, token)

  // Wait for found matched UTXO after merge or split.
  const selectedUtxo = await waitForExitUtxo(
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

export const waitForExitUtxo = (
  desiredAmount,
  fromUtxoPos,
  blockchainWallet,
  token
) => {
  let utxoPos = fromUtxoPos
  return Polling.pollUntilSuccess(async () => {
    const utxos = await getNewUtxos(utxoPos + 1, blockchainWallet, token)
    const hasNewUtxos = utxos.length > 0
    const desiredAmountUtxo = utxos.find(utxo => utxo.amount === desiredAmount)

    if (hasNewUtxos && desiredAmountUtxo) {
      return {
        success: true,
        data: desiredAmountUtxo
      }
    } else if (hasNewUtxos) {
      await transfer(blockchainWallet, blockchainWallet.address, token)
      utxoPos = utxos[0].utxo_pos
    }
    return {
      success: false
    }
  }, 3000)
}

const getUtxoByAmount = async (amount, blockchainWallet, token) => {
  const utxos = await Plasma.getUtxos(blockchainWallet.address, {
    currency: token.contractAddress
  })

  return utxos.find(utxo => utxo.amount === amount)
}

const getNewUtxos = async (fromUtxoPos, blockchainWallet, token) => {
  return Plasma.getUtxos(blockchainWallet.address, {
    fromUtxoPos: fromUtxoPos,
    currency: token.contractAddress
  })
}
