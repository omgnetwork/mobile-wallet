import { Ethereum, Token } from 'common/blockchain'
import { ContractAddress } from 'common/constants'
import { ContractABI, Datetime } from 'common/utils'
import { providerService } from 'common/services'

export const fetchAssets = async (provider, address, lastBlockNumber) => {
  try {
    const txHistory = await providerService.getTransactionHistory(
      address,
      lastBlockNumber
    )

    const tokenContractAddresses = Array.from(
      new Set(txHistory.map(tx => tx.contractAddress))
    )

    const tokens = await Token.fetchTokens(
      provider,
      [ContractAddress.ETH_ADDRESS, ...tokenContractAddresses],
      address
    )

    const rootchainAssets = mapTokensToRootchainAssets(tokens).filter(
      token => token.balance !== '0.0'
    )

    const updatedBlock = getUpdatedBlock(txHistory)

    return {
      address,
      rootchainAssets,
      updatedBlock,
      updatedAt: Datetime.now()
    }
  } catch (err) {
    console.log(err)
    throw new Error(
      `Unable to fetch the rootchain assets for address ${address}.`
    )
  }
}

const mapTokensToRootchainAssets = tokens => {
  return Object.keys(tokens).map(contractAddress => tokens[contractAddress])
}

const getUpdatedBlock = txHistory => {
  return (txHistory.length && txHistory.slice(-1).pop().blockNumber) || 0
}

export const fetchEthToken = (pendingEthBalance, pendingEthPrice) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [balance, price] = await Promise.all([
        pendingEthBalance,
        pendingEthPrice
      ])

      if (balance === '0.0') {
        resolve(null)
      } else {
        resolve({
          tokenName: 'Ether',
          tokenSymbol: 'ETH',
          tokenDecimal: 18,
          contractAddress: ContractAddress.ETH_ADDRESS,
          balance: balance,
          price: price
        })
      }
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
    // const
    //    const pendingTokens = tokens.map(contractAddress => {
    //      return new Promise(async (resolve, reject) => {
    //        try {
    //          const token = txHistory.find(
    //            tx => tx.contractAddress === contractAddress
    //          )
    //
    //          const pendingTokenBalance = providerService.getTokenBalance(
    //            provider,
    //            contractAddress,
    //            token.tokenDecimal,
    //            address
    //          )
    //
    //          const pendingTokenPrice = priceService.fetchPriceUsd(
    //            contractAddress,
    //            Config.ETHERSCAN_NETWORK
    //          )
    //
    //          const [tokenBalance, tokenPrice] = await Promise.all([
    //            pendingTokenBalance,
    //            pendingTokenPrice
    //          ])
    //
    //          resolve({
    //            tokenName: token.tokenName,
    //            tokenSymbol: token.tokenSymbol,
    //            tokenDecimal: token.tokenDecimal,
    //            contractAddress: contractAddress,
    //            balance: tokenBalance,
    //            price: tokenPrice
    //          })
    //        } catch (err) {
    //          console.log(err)
    //          reject(
    //            new Error(
    //              `Cannot fetch ERC20 token at contract address: ${contractAddress}`
    //            )
    //          )
    //        }
    //      })
    //    })

    //    return pendingTokens
  } catch (err) {
    console.log(err)
    return new Error(`Cannot fetch ERC20 tokens.`)
  }
}

export const sendErc20Token = (wallet, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const abi = ContractABI.erc20Abi()
      const { token } = options
      const contract = new Ethereum.getContract(
        token.contractAddress,
        abi,
        wallet
      )
      const pendingTransaction = await Ethereum.sendErc20Token(
        contract,
        options
      )
      resolve(pendingTransaction)
    } catch (err) {
      reject(err)
    }
  })
}

export const sendEthToken = (wallet, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transactionResponse = await Ethereum.sendEthToken(wallet, options)
      resolve(transactionResponse)
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
