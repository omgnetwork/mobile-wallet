import { ethersUtils } from '../utils'
import { settingStorage } from '../storages'

export const create = providerName => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = ethersUtils.createProvider(providerName)
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

export const getTransactionHistory = (provider, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await ethersUtils.fetchTransactionDetail(address)

      const formattedTxHistory = response.data.result.map(tx => {
        return {
          hash: tx.hash,
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

export const getTokenBalance = (provider, contractAddress, accountAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      const balance = await ethersUtils.getTokenBalance(
        provider,
        contractAddress,
        accountAddress
      )

      resolve(ethersUtils.bignumberToString(balance))
    } catch (err) {
      reject(err)
    }
  })
}
