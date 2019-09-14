import { Childchain, Formatter, Parser } from '../utils'

export const fetchAssets = (rootchainAssets, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const balances = await Childchain.getBalances(address)

      const childchainAssets = balances.map(balance => {
        const token = rootchainAssets.find(
          asset => balance.currency === asset.contractAddress
        )

        if (token) {
          return {
            ...token,
            balance: Formatter.formatUnits(
              balance.amount.toFixed(),
              token.tokenDecimal
            )
          }
        } else {
          return {
            tokenName: 'UNK',
            tokenSymbol: 'Unknown',
            tokenDecimal: 18,
            contractAddress: '0x123456',
            balance: Formatter.formatUnits(
              balance.amount.toFixed(),
              token.tokenDecimal
            ),
            price: 1
          }
        }
      })

      resolve(childchainAssets)
    } catch (err) {
      reject(err)
    }
  })
}

export const getResolvedPendingTxs = (pendingTxs, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transactions = await Childchain.getTransactions(address)
      resolve(
        transactions.filter(
          tx =>
            pendingTxs.find(pendingTx => pendingTx.txhash === tx.hash) !==
            undefined
        )
      )
    } catch (err) {
      reject(err)
    }
  })
}

export const transfer = (fromBlockchainWallet, toAddress, token, fee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payments = Childchain.createPayment(
        toAddress,
        token.contractAddress,
        Parser.parseUnits(token.balance, token.tokenDecimal)
      )

      const childchainFee = Childchain.createFee(
        Parser.parseUnits(fee.amount, 'gwei')
      )

      const createdTransactions = await Childchain.createTransaction(
        fromBlockchainWallet.address,
        payments,
        childchainFee
      )

      const transaction = createdTransactions.transactions[0]

      // Remove the exponential notion from the amount when converting to string.
      const sanitizedTransaction = {
        ...transaction,
        inputs: transaction.inputs.map(input => ({
          ...input,
          amount: input.amount.toString(10)
        })),
        outputs: transaction.outputs.map(output => ({
          ...output,
          amount: output.amount.toString(10)
        }))
      }

      const typedData = Childchain.getTypedData(sanitizedTransaction)
      const signatures = Childchain.signTransaction(
        typedData,
        fromBlockchainWallet.privateKey
      )

      const signedTransaction = Childchain.buildSignedTransaction(
        typedData,
        new Array(sanitizedTransaction.inputs.length).fill(signatures[0])
      )

      const transactionReceipt = await Childchain.submitTransaction(
        signedTransaction
      )

      resolve(transactionReceipt)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

export const depositEth = (address, privateKey, amount, fee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const weiAmount = Parser.parseUnits(amount, 'ether')
      const transactionReceipt = await Childchain.depositEth(
        address,
        privateKey,
        weiAmount,
        {
          gasPrice: Parser.parseUnits(fee.amount, fee.symbol)
        }
      )
      console.log(transactionReceipt)
      resolve(transactionReceipt)
    } catch (err) {
      reject(err)
    }
  })
}

export const depositErc20 = (address, privateKey, token, fee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const weiAmount = Parser.parseUnits(token.balance, token.tokenDecimal)
      const transactionReceipt = await Childchain.depositErc20(
        address,
        privateKey,
        weiAmount,
        token.contractAddress,
        {
          gasPrice: Parser.parseUnits(fee.amount, fee.symbol)
        }
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
      // Prepare UTXO with exact desired amount to be transferred.
      const receipt = await transfer(
        blockchainWallet,
        blockchainWallet.address,
        token,
        fee
      )

      console.log(receipt)

      const unlockReceipt = await Childchain.unlockTokenExitable(
        token.contractAddress,
        {
          gasPrice: Parser.parseUnits(fee.amount, fee.symbol),
          gas: 500000,
          from: blockchainWallet.address,
          privateKey: blockchainWallet.privateKey
        }
      )

      console.log(unlockReceipt)

      const desiredAmount = Parser.parseUnits(token.balance, token.tokenDecimal)

      // Wait for found matched UTXO after merge or split.
      const selectedUtxo = await waitUntilFoundMatchedUTXO(
        desiredAmount,
        blockchainWallet,
        token
      )

      const exitData = await Childchain.getExitData(selectedUtxo)
      console.log('selectedUtxo', selectedUtxo)

      const startExitReceipt = await Childchain.standardExit(
        exitData,
        blockchainWallet,
        {
          gas: 1000000,
          gasPrice: Parser.parseUnits(fee.amount, fee.symbol)
        }
      )

      console.log('Exit receipt', startExitReceipt)
      resolve(startExitReceipt)
    } catch (err) {
      reject(err)
    }
  })
}

function waitUntilFoundMatchedUTXO(desiredAmount, blockchainWallet, token) {
  return new Promise((waitResolve, waitReject) => {
    setTimeout(async () => {
      // Reload UTXOs
      const utxos = await Childchain.getUtxos(blockchainWallet.address, {
        currency: token.contractAddress
      })

      // Find the correct one
      const selectedUtxo = utxos.find(utxo =>
        utxo.amount.isEqualTo(desiredAmount)
      )

      if (selectedUtxo) {
        console.log('resolve', selectedUtxo)
        waitResolve(selectedUtxo)
      } else {
        console.log(utxos)
        return await waitUntilFoundMatchedUTXO(
          desiredAmount,
          blockchainWallet,
          token
        )
      }
    }, 3000)
  })
}

export const wait = ms => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}
