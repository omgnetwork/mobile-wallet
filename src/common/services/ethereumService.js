import { Ethereum } from 'common/blockchain'
import { ContractAddress } from 'common/constants'
import Config from 'react-native-config'
import { Datetime, Formatter } from 'common/utils'
import { providerService, priceService } from 'common/services'

export const getEthBalance = address => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Ethereum.getEthBalance(address)
      const balance = response.data.result
      const formattedBalance = Formatter.formatUnits(balance, 18)
      resolve(formattedBalance)
    } catch (err) {
      reject(err)
    }
  })
}

export const fetchAssets = (provider, address, lastBlockNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const txHistory = await providerService.getTransactionHistory(
        address,
        lastBlockNumber
      )

      const pendingEthPrice = priceService.fetchPriceUsd(
        ContractAddress.ETH_ADDRESS,
        Config.ETHERSCAN_NETWORK
      )
      const pendingEthBalance = getEthBalance(address)

      const pendingEthToken = fetchEthToken(pendingEthBalance, pendingEthPrice)
      const pendingERC20Tokens = fetchERC20Token(txHistory, provider, address)
      const rootchainAssets = await Promise.all([
        pendingEthToken,
        ...pendingERC20Tokens
      ])

      const updatedBlock =
        (txHistory.length && txHistory.slice(-1).pop().blockNumber) || 0
      const updatedAssets = {
        address,
        rootchainAssets,
        updatedBlock,
        updatedAt: Datetime.now()
      }

      resolve(updatedAssets)
    } catch (err) {
      console.log(err)
      reject(new Error(`Cannot fetch rootchainAssets for address ${address}.`))
    }
  })
}

export const fetchEthToken = (pendingEthBalance, pendingEthPrice) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [balance, price] = await Promise.all([
        pendingEthBalance,
        pendingEthPrice
      ])

      resolve({
        tokenName: 'Ether',
        tokenSymbol: 'ETH',
        tokenDecimal: 18,
        contractAddress: ContractAddress.ETH_ADDRESS,
        balance: balance,
        price: price
      })
    } catch (err) {
      console.log(err)
      reject(new Error(`Cannot fetch eth token.`))
    }
  })
}

export const fetchERC20Token = (txHistory, provider, address) => {
  try {
    const tokenSet = new Set(txHistory.map(tx => tx.contractAddress))
    const tokens = Array.from(tokenSet)
    const pendingTokens = tokens.map(contractAddress => {
      return new Promise(async (resolve, reject) => {
        try {
          const token = txHistory.find(
            tx => tx.contractAddress === contractAddress
          )

          const pendingTokenBalance = providerService.getTokenBalance(
            provider,
            contractAddress,
            token.tokenDecimal,
            address
          )

          const pendingTokenPrice = priceService.fetchPriceUsd(
            contractAddress,
            Config.ETHERSCAN_NETWORK
          )

          const [tokenBalance, tokenPrice] = await Promise.all([
            pendingTokenBalance,
            pendingTokenPrice
          ])

          resolve({
            tokenName: token.tokenName,
            tokenSymbol: token.tokenSymbol,
            tokenDecimal: token.tokenDecimal,
            contractAddress: contractAddress,
            balance: tokenBalance,
            price: tokenPrice
          })
        } catch (err) {
          console.log(err)
          reject(
            new Error(
              `Cannot fetch ERC20 token at contract address: ${contractAddress}`
            )
          )
        }
      })
    })

    return pendingTokens
  } catch (err) {
    console.log(err)
    return new Error(`Cannot fetch ERC20 tokens.`)
  }
}

export const sendErc20Token = (wallet, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethereum.sendErc20Token(wallet, options)
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const sendEthToken = (wallet, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pendingTransaction = await Ethereum.sendEthToken(wallet, options)
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const getTxs = (address, options, onlyErc20) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response
      if (onlyErc20) {
        response = await Ethereum.getERC20Txs(address, options)
      } else {
        response = await Ethereum.getTxs(address, options)
      }
      const currentRootchainTxs = response.data.result
      resolve(currentRootchainTxs)
    } catch (err) {
      reject(err)
    }
  })
}
