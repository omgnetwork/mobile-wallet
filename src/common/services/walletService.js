import { Formatter, Datetime } from '../utils'
import { walletStorage } from '../storages'
import { ContractAddress } from 'common/constants'
import { Ethereum } from 'common/blockchain'
import { priceService, providerService } from '../services'
import Config from 'react-native-config'

export const get = async (address, provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mnemonic = await walletStorage.getMnemonic(address)
      const wallet = Ethereum.importWalletMnemonic(mnemonic)
      const connectedProviderWallet = wallet.connect(provider)
      resolve(connectedProviderWallet)
    } catch (err) {
      reject(err)
    }
  })
}

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

export const importByMnemonic = (wallets, mnemonic, provider, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mnemonic.split(' ').length !== 12) {
        throw new Error('Invalid mnemonic')
      }

      if (!name) {
        throw new Error('Wallet name is empty')
      }

      const wallet = Ethereum.importWalletMnemonic(mnemonic)
      const connectedProviderWallet = wallet.connect(provider)

      const address = await connectedProviderWallet.address
      const balance = await connectedProviderWallet.getBalance()

      if (wallets.find(w => w.address === address)) {
        throw new Error(
          'Cannot add the wallet. The wallet has already existed.'
        )
      } else if (wallets.find(w => w.name === name)) {
        throw new Error(
          'Cannot add the wallet. The wallet name has already been taken.'
        )
      }

      await walletStorage.setMnemonic({ address, mnemonic })

      const newWallet = { address, name, balance, shouldRefresh: true }

      resolve(newWallet)
    } catch (err) {
      reject(err)
    }
  })
}
