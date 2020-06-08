import { Price } from '../utils'

export const fetchPriceUsd = async (contractAddress, network) => {
  const { price } = await Price.fetchPriceUsd(contractAddress, network)
  return price
}
