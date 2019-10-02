import { ContractAddress } from 'common/constants'
import { Ethereum } from 'common/blockchain'

export const fetchTokens = (provider, contractAddresses) => {
  return new Promise(async (resolve, reject) => {
    const pendingTokenDetails = contractAddresses.map(contractAddress => {
      if (contractAddress === ContractAddress.ETH_ADDRESS) {
        return Promise.all([
          Promise.resolve('Ether'),
          Promise.resolve('ETH'),
          Promise.resolve(18),
          Promise.resolve(contractAddress)
        ])
      } else {
        const tokenDetails = Ethereum.getERC20Details(provider, contractAddress)
        return Promise.all([...tokenDetails, Promise.resolve(contractAddress)])
      }
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
