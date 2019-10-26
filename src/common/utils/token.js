import { Ethereum } from 'common/blockchain'

export const fetchTokens = (provider, contractAddresses) => {
  return new Promise(async (resolve, reject) => {
    const pendingTokenDetails = contractAddresses.map(contractAddress => {
      return new Promise(async (resolveToken, rejectToken) => {
        const detail = await Promise.all(
          Ethereum.getTokenDetail(provider, contractAddress)
        )
        resolveToken(detail)
      })
    })

    const resolvedTokenDetails = await Promise.all(pendingTokenDetails)

    const tokenDetails = resolvedTokenDetails.map(tokenDetail => {
      const [
        tokenName,
        tokenSymbol,
        tokenDecimal,
        contractAddress
      ] = tokenDetail
      return {
        tokenName,
        tokenSymbol,
        tokenDecimal,
        contractAddress
      }
    })

    resolve(tokenDetails)
  })
}

export const find = (contractAddress, tokens) => {
  return tokens.find(token => token.contractAddress === contractAddress)
}
