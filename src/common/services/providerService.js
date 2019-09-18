import { Rootchain, Formatter } from '../utils'
import { settingStorage } from '../storages'

export const create = async providerName => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await Rootchain.createProvider(providerName)
      resolve(provider)
    } catch (err) {
      reject(err)
    }
  })
}

export const getName = async defaultProviderName => {
  const providerName = await settingStorage.getProviderName()
  return providerName || defaultProviderName
}

export const getTransactionHistory = (address, lastBlockNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Rootchain.fetchTransactionDetail(
        address,
        lastBlockNumber
      )

      console.log(response)

      const formattedTxHistory = response.data.result.map(tx => {
        return {
          hash: tx.hash,
          blockNumber: tx.blockNumber,
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          tokenDecimal: tx.tokenDecimal,
          contractAddress: tx.contractAddress,
          value: tx.value,
          timestamp: tx.timeStamp,
          from: tx.from,
          to: tx.to
        }
      })

      resolve(formattedTxHistory)
    } catch (err) {
      reject(err)
    }
  })
}

export const getTokenBalance = (
  provider,
  contractAddress,
  tokenDecimal,
  accountAddress
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const balance = await Rootchain.getTokenBalance(
        provider,
        contractAddress,
        accountAddress
      )

      resolve(Formatter.formatUnits(balance, tokenDecimal))
    } catch (err) {
      reject(err)
    }
  })
}
