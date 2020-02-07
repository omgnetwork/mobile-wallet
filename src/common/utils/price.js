import { ContractAddress } from 'common/constants'
const USD_PER_ETH = 217.37 // $217.37 Price at 2020/02/07

export const fetchPriceUsd = (contractAddress, network) => {
  // mainnet
  if (network === 'homestead' || network === 'mainnet') {
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
