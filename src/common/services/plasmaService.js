import { Formatter, Parser, Polling, Datetime, Mapper } from 'common/utils'
import { Plasma, Token } from 'common/blockchain'
import { Gas } from 'common/constants'
import BN from 'bn.js'

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

export const getFees = async () => {
  try {
    const fees = await Plasma.getFees()
    return { fees, updatedAt: fees[0].updated_at }
  } catch (err) {
    throw err
  }
}

export const transfer = (fromBlockchainWallet, toAddress, token, metadata) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payments = Plasma.createPayment(
        toAddress,
        token.contractAddress,
        Parser.parseUnits(token.balance, token.tokenDecimal).toString(10)
      )
      const childchainFee = Plasma.createFee('1')
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

export const depositEth = (address, privateKey, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const weiAmount = Parser.parseUnits(amount, 'ether').toString(10)

      const { hash, gasPrice, gasUsed } = await Plasma.depositEth(
        address,
        privateKey,
        new BN(weiAmount)
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

export const depositErc20 = (address, privateKey, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const weiAmount = Parser.parseUnits(
        token.balance,
        token.tokenDecimal
      ).toString(10)

      const { hash, gasPrice, gasUsed } = await Plasma.depositErc20(
        address,
        privateKey,
        weiAmount,
        token.contractAddress
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

export const exit = (blockchainWallet, token) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the token has been unlocked
      const hasToken = await Plasma.hasToken(token.contractAddress)

      if (!hasToken) {
        await Plasma.addToken(token.contractAddress, {
          from: blockchainWallet.address,
          privateKey: blockchainWallet.privateKey
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
      const gasPrice = Gas.EXIT_GAS_PRICE

      const { transactionHash: hash } = await Plasma.standardExit(
        exitData,
        blockchainWallet,
        { gasPrice }
      )
      const exitId = await Plasma.getStandardExitId(utxoToExit, exitData)
      const { address, bonds } = await Plasma.getPaymentExitGameAddress()
      const standardExitBond = bonds.standardExit.toString()

      resolve({
        hash,
        exitId,
        blknum: utxoToExit.blknum,
        to: address,
        flatFee: standardExitBond,
        gasPrice
      })
    } catch (err) {
      reject(err)
    }
  })
}

// We're not using this right now but let's keep it because it still has potential to be used in the future.
// export const processExits = (blockchainWallet, exitId, contractAddress) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const { transactionHash } = await Plasma.processExits(
//         contractAddress,
//         exitId,
//         {
//           gas: Gas.HIGH_LIMIT,
//           from: blockchainWallet.address,
//           privateKey: blockchainWallet.privateKey
//         }
//       )

//       await Plasma.waitForRootchainTransaction({
//         transactionHash,
//         intervalMs: 15000,
//         confirmationThreshold: Config.CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS,
//         onCountdown: remaining =>
//           console.log(
//             `Process exit confirmation is remaining by ${remaining} blocks`
//           )
//       })

//       resolve({ transactionHash })
//     } catch (err) {
//       console.log(err)
//       reject(err)
//     }
//   })
// }

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
  return Polling.pollUntilSuccess(async () => {
    const utxo = await getNewUtxoByAmount(
      desiredAmount,
      fromUtxoPos + 1,
      blockchainWallet,
      token
    )

    if (utxo) {
      return {
        success: true,
        data: utxo
      }
    } else {
      return {
        success: false
      }
    }
  }, 3000)
}

const getUtxoByAmount = async (amount, blockchainWallet, token) => {
  const utxos = await Plasma.getUtxos(blockchainWallet.address, {
    currency: token.contractAddress
  })

  return utxos.find(utxo => utxo.amount === amount)
}

const getNewUtxoByAmount = async (
  amount,
  fromUtxoPos,
  blockchainWallet,
  token
) => {
  const utxos = await Plasma.getUtxos(blockchainWallet.address, {
    fromUtxoPos: fromUtxoPos,
    currency: token.contractAddress
  })

  return utxos.find(utxo => utxo.amount === amount)
}
