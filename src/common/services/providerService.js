import { Ethereum } from 'common/blockchain'
import { settingStorage } from '../storages'

export const create = async providerName => {
  return Ethereum.createProvider(providerName)
}

export const getName = async defaultProviderName => {
  const providerName = await settingStorage.getProviderName()
  return providerName || defaultProviderName
}

export const getTransactionHistory = async (address, lastBlockNumber) => {
  try {
    const response = await Ethereum.getERC20Txs(address, lastBlockNumber)

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

    return formattedTxHistory
  } catch (err) {
    throw new Error(err)
  }
}
