import { Formatter, Parser, Polling, Datetime, Mapper, Token } from '../utils'
import { Plasma } from 'common/blockchain'
import { Gas } from 'common/constants'
import { priceService } from 'common/services'
import Config from 'react-native-config'

export const fetchAssets = (provider, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [balances, utxos] = await Promise.all([
        Plasma.getBalances(address),
        Plasma.getUtxos(address)
      ])

      const currencies = balances.map(Mapper.mapAssetCurrency)
      const contractAddresses = Array.from(new Set(currencies))
      const tokens = await Token.fetchTokens(provider, contractAddresses)

      const unconfirmedChildchainAssets = balances.map(balance => {
        return new Promise(async (resolveBalance, rejectBalance) => {
          const token = tokens.find(t => balance.currency === t.contractAddress)

          const tokenPrice = await priceService.fetchPriceUsd(
            token.contractAddress,
            Config.ETHERSCAN_NETWORK
          )

          if (token) {
            resolveBalance({
              ...token,
              balance: Formatter.formatUnits(
                balance.amount.toFixed(),
                token.tokenDecimal
              ),
              price: tokenPrice
            })
          } else {
            resolveBalance({
              tokenName: 'UNK',
              tokenSymbol: 'Unknown',
              tokenDecimal: 18,
              contractAddress: '0x123456',
              balance: Formatter.formatUnits(
                balance.amount.toFixed(),
                token.tokenDecimal
              ),
              price: tokenPrice
            })
          }
        })
      })

      const childchainAssets = await Promise.all(unconfirmedChildchainAssets)

      resolve({
        lastUtxoPos: (utxos.length && utxos[0].utxo_pos.toString(10)) || '0',
        childchainAssets,
        updatedAt: Datetime.now()
      })
    } catch (err) {
      reject(err)
    }
  })
}

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

export const getTx = transactionHash => {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = await Plasma.getTx(transactionHash)
      resolve({
        hash: transaction.txhash,
        ...transaction
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const transfer = (
  fromBlockchainWallet,
  toAddress,
  token,
  fee,
  metadata
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payments = Plasma.createPayment(
        toAddress,
        token.contractAddress,
        Parser.parseUnits(token.balance, token.tokenDecimal)
      )

      const childchainFee = Plasma.createFee(
        Parser.parseUnits(fee.amount, 'Gwei')
      )

      const createdTransactions = await Plasma.createTx(
        fromBlockchainWallet.address,
        payments,
        childchainFee,
        metadata
      )

      const transaction = createdTransactions.transactions[0]

      // Remove the exponential notion from the amount when converting to string.
      const sanitizedTransaction = {
        ...transaction,
        inputs: transaction.inputs.map(input => ({
          ...input,
          amount: input.amount.toString(10),
          utxo_pos: input.utxo_pos.toString(10)
        })),
        outputs: transaction.outputs.map(output => ({
          ...output,
          amount: output.amount.toString(10)
        }))
      }

      const typedData = Plasma.getTypedData(sanitizedTransaction)

      const signatures = Plasma.signTx(
        typedData,
        fromBlockchainWallet.privateKey
      )

      const signedTransaction = Plasma.buildSignedTx(
        typedData,
        new Array(sanitizedTransaction.inputs.length).fill(signatures[0])
      )

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
      const transactionReceipt = await Plasma.depositEth(
        address,
        privateKey,
        weiAmount
      )
      resolve(transactionReceipt)
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
      const transactionReceipt = await Plasma.depositErc20(
        address,
        privateKey,
        weiAmount,
        token.contractAddress
      )
      resolve(transactionReceipt)
    } catch (err) {
      reject(err)
    }
  })
}

export const exit = (blockchainWallet, token, fee) => {
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

      const desiredAmount = Parser.parseUnits(token.balance, token.tokenDecimal)

      // For now `getUtxos` includes exited utxos, so after this issue https://github.com/omisego/elixir-omg/issues/1151 has been solved,
      // we can then uncomment the function below to reduce unnecessary api call.
      const utxoToExit = await createUtxoWithAmount(
        desiredAmount,
        blockchainWallet,
        token,
        fee
      )

      // const utxoToExit = await createUtxoWithAmount(
      //   desiredAmount,
      //   blockchainWallet,
      //   token,
      //   fee
      // )

      const exitData = await Plasma.getExitData(utxoToExit)

      const { transactionHash } = await Plasma.standardExit(
        exitData,
        blockchainWallet,
        {}
      )

      const exitId = await Plasma.getStandardExitId(utxoToExit, exitData)

      resolve({ transactionHash, exitId })
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
//           gas: Gas.LIMIT,
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
  token,
  fee
) => {
  await transfer(blockchainWallet, blockchainWallet.address, token, fee, null)

  // Wait for found matched UTXO after merge or split.
  const selectedUtxo = await waitForExitUtxo(
    desiredAmount,
    blockchainWallet,
    token
  )

  if (!selectedUtxo) return null

  return {
    ...selectedUtxo,
    amount: selectedUtxo.amount.toString(10)
  }
}

export const waitForExitUtxo = (desiredAmount, blockchainWallet, token) => {
  return Polling.pollUntilSuccess(async () => {
    const utxo = await getUtxoByAmount(desiredAmount, blockchainWallet, token)

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
  }, 5000)
}

const getUtxoByAmount = async (amount, blockchainWallet, token) => {
  const utxos = await Plasma.getUtxos(blockchainWallet.address, {
    currency: token.contractAddress
  })

  return utxos.find(utxo => utxo.amount.isEqualTo(amount))
}
