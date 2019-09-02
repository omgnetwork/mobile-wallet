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
      const typedData = Childchain.getTypedData(transaction)
      const signatures = await Childchain.signTransaction(
        typedData,
        fromBlockchainWallet.privateKey
      )

      const signedTransaction = await Childchain.buildSignedTransaction(
        typedData,
        new Array(transaction.inputs.length).fill(signatures[0])
      )

      const transactionReceipt = await Childchain.submitTransaction(
        signedTransaction
      )
      resolve(transactionReceipt)
    } catch (err) {
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

export const wait = ms => {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}
