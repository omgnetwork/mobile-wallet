import { Ethereum } from 'common/blockchain'

export const fetchTokens = (provider, contractAddresses) => {
  const pendingTokenDetails = contractAddresses.map(contractAddress => {
    return Promise.all(Ethereum.getTokenDetail(provider, contractAddress))
  })
  return Promise.all(pendingTokenDetails).then(tokens => {
    return tokens.reduce(
      (tokenMap, [tokenName, tokenSymbol, tokenDecimal, contractAddress, price]) => {
        tokenMap[contractAddress] = { tokenName, tokenSymbol, tokenDecimal, price }
        return tokenMap
      },
      {}
    )
  })
}

export const find = (contractAddress, tokens) => {
  return tokens.find(token => token.contractAddress === contractAddress)
}
