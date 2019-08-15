import { priceUtils } from '../utils'

export const fetchPriceUsd = (contractAddress, network) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tokenPrice = await priceUtils.fetchPriceUsd(
        contractAddress,
        network
      )
      resolve(tokenPrice.price)
    } catch (err) {
      reject(err)
    }
  })
}
