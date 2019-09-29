import { Formatter, Parser, Polling } from '../utils'
import { Plasma } from 'common/blockchain'

export const fetchAssets = (rootchainAssets, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [balances, utxos] = await Promise.all([
        Plasma.getBalances(address),
        Plasma.getUtxos(address)
      ])

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

      resolve({
        lastUtxoPos: (utxos.length && utxos[0].utxo_pos.toString(10)) || '0',
        childchainAssets
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

export const depositEth = (address, privateKey, amount, fee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const weiAmount = Parser.parseUnits(amount, 'ether')
      const transactionReceipt = await Plasma.depositEth(
        address,
        privateKey,
        weiAmount,
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

export const depositErc20 = (address, privateKey, token, fee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const weiAmount = Parser.parseUnits(token.balance, token.tokenDecimal)
      const transactionReceipt = await Plasma.depositErc20(
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
        fee,
        null
      )

      const unlockReceipt = await Plasma.unlockTokenExitable(
        token.contractAddress,
        {
          gasPrice: Parser.parseUnits(fee.amount, fee.symbol),
          gas: 500000,
          from: blockchainWallet.address,
          privateKey: blockchainWallet.privateKey
        }
      )

      const desiredAmount = Parser.parseUnits(token.balance, token.tokenDecimal)

      // Wait for found matched UTXO after merge or split.
      const selectedUtxo = await subscribeExit(
        desiredAmount,
        blockchainWallet,
        token
      )

      const exitData = await Plasma.getExitData(selectedUtxo)

      const startExitReceipt = await Plasma.standardExit(
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

export const processExits = (blockchainWallet, token, fee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receipt = await Plasma.processExits(token.contractAddress, {
        gasPrice: Parser.parseUnits(fee.amount, fee.symbol),
        gas: 500000,
        from: blockchainWallet.address,
        privateKey: blockchainWallet.privateKey
      })

      resolve(receipt)
    } catch (err) {
      reject(err)
    }
  })
}

// Subscribe exit
export const subscribeExit = (desiredAmount, blockchainWallet, token) => {
  return Polling.poll(async () => {
    // Reload UTXOs
    const utxos = await Plasma.getUtxos(blockchainWallet.address, {
      currency: token.contractAddress
    })

    // Find the correct one
    const selectedUtxo = utxos.find(utxo =>
      utxo.amount.isEqualTo(desiredAmount)
    )

    if (selectedUtxo) {
      return {
        success: true,
        data: selectedUtxo
      }
    } else {
      return {
        success: false
      }
    }
  }, 5000)
}
