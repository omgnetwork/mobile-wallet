export const fetchPriceUsd = (contractAddress, network) => {
  // ETH mainnet
  if (network === 'homestead') {
    //TODO Fetch price from Coinmarketcap.
    return Promise.resolve({
      contractAddress,
      price: 1
    })
  } else {
    return Promise.resolve({
      contractAddress,
      price: 1
    })
  }
}
