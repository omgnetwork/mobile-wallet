import { Ethers } from '../utils'
import { settingStorage } from '../storages'

export const create = providerName => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = Ethers.createProvider(providerName)
      await settingStorage.setProviderName(providerName)
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

export const getTransactionHistory = address => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Ethers.fetchTransactionDetail(address)

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
      const balance = await Ethers.getTokenBalance(
        provider,
        contractAddress,
        accountAddress
      )

      resolve(Ethers.formatUnits(balance, tokenDecimal))
    } catch (err) {
      reject(err)
    }
  })
}
