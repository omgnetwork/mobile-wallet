import { ContractAddress } from 'common/constants'

const USD_PER_ETH = 126.28 // $126.28 Price at 2019/12/26

export const fetchPriceUsd = (contractAddress, network) => {
  // mainnet
  if (network === 'homestead') {
    //TODO Fetch price from Coinmarketcap.
    return Promise.resolve({
      contractAddress,
      price: 1
    })
  } else {
    if (contractAddress === ContractAddress.ETH_ADDRESS) {
      return Promise.resolve({
        contractAddress,
        price: USD_PER_ETH
      })
    } else {
      return Promise.resolve({
        contractAddress,
        price: 1
      })
    }
  }
}
