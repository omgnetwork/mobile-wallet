import { createAsyncActionWithTokenCaching } from './actionCreators'
import { depositService } from 'common/services'
import _ from 'lodash'
import { Token } from 'common/utils'

export const fetchDepositHistory = (provider, address, tokenCache, options) => {
  const asyncAction = async () => {
    const rawDeposits = await depositService.getDeposits(address, options)
    const allDepositTokens = _.uniq(_.map(rawDeposits, 'contractAddress'))

    const { tokenInfo, tokenInfoToCache } = await getTokenInfo(
      tokenCache,
      allDepositTokens,
      address
    )

    const deposits = rawDeposits.map(deposit =>
      addTokenInfo(deposit, tokenInfo)
    )

    return { deposits, tokenInfoToCache }
  }

  return createAsyncActionWithTokenCaching({
    operation: asyncAction,
    type: 'DEPOSITS/ALL'
  })
}

const getTokenInfo = async (tokenCache, tokensToQuery, address) => {
  const tokenInfoToCache = {}
  const filteredTokenCache = _.pickBy(
    tokenCache,
    tokenInfo => !_.includes(tokenInfo, 'UNKNOWN')
  )
  const isCached = _.keys(filteredTokenCache)
  const isNotCached = _.difference(tokensToQuery, isCached)

  await Promise.all(
    isNotCached.map(async currency => {
      const info = await Token.getContractInfo(currency, address)
      tokenInfoToCache[currency] = info
    })
  )

  return {
    tokenInfo: { ...filteredTokenCache, ...tokenInfoToCache },
    tokenInfoToCache
  }
}

const addTokenInfo = (deposit, tokens) => {
  return { ...deposit, ...tokens[deposit.contractAddress] }
}
