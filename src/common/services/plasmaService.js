import { Plasma, Ethers } from '../utils'

export const fetchAssets = (rootchainAssets, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const balances = await Plasma.getEthBalance(address)

      const plasmaAssets = balances.map(balance => {
        const token = rootchainAssets.find(
          asset => balance.currency === asset.contractAddress
        )
        if (token) {
          return {
            ...token,
            balance: Ethers.formatUnits(
              balance.amount.toString(),
              token.tokenDecimal
            )
          }
        } else {
          return {
            tokenName: 'UNK',
            tokenSymbol: 'Unknown',
            tokenDecimal: 18,
            contractAddress: '0x123456',
            balance: Ethers.formatUnits(
              balance.amount.toString(),
              token.tokenDecimal
            ),
            price: 1
          }
        }
      })
      resolve(plasmaAssets)
    } catch (err) {
      reject(err)
    }
  })
}

export const transfer = (fromBlockchainWallet, toAddress, token, fee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const payments = Plasma.createPayment(
        toAddress,
        token.contractAddress,
        Ethers.parseUnits(token.balance, token.tokenDecimal)
      )
      const plasmaFee = Plasma.createFee(Ethers.parseUnits(fee.amount, 'gwei'))

      const createdTransactions = await Plasma.createTransaction(
        fromBlockchainWallet.address,
        payments,
        plasmaFee
      )

      const transaction = createdTransactions.transactions[0]
      const typedData = Plasma.getTypedData(transaction)
      const signatures = await Plasma.signTransaction(
        typedData,
        fromBlockchainWallet.privateKey
      )

      const signedTransaction = await Plasma.buildSignedTransaction(
        typedData,
        new Array(transaction.inputs.length).fill(signatures[0])
      )

      const transactionReceipt = await Plasma.submitTransaction(
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
      const weiAmount = Ethers.parseUnits(amount, 'ether')
      const transactionReceipt = await Plasma.depositEth(
        address,
        privateKey,
        weiAmount,
        {
          gasPrice: Ethers.parseUnits(fee.amount, fee.symbol)
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
      const weiAmount = Ethers.parseUnits(token.balance, token.tokenDecimal)
      const transactionReceipt = await Plasma.depositErc20(
        address,
        privateKey,
        weiAmount,
        token.contractAddress,
        {
          gasPrice: Ethers.parseUnits(fee.amount, fee.symbol)
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
