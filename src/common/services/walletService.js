import { Ethers, Datetime } from '../utils'
import { walletStorage, settingStorage } from '../storages'
import { priceService, providerService } from '../services'
import Config from 'react-native-config'

export const create = (provider, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const wallet = Ethers.createWallet()
      const connectedProviderWallet = wallet.connect(provider)

      const privateKey = await connectedProviderWallet.privateKey
      const address = await connectedProviderWallet.address
      const balance = await connectedProviderWallet.getBalance()

      await walletStorage.setPrivateKey({ address, privateKey })
      // await walletStorage.add({ address, balance, name })

      resolve({ address, balance, name })
    } catch (err) {
      reject(err)
    }
  })
}

export const get = async (address, provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      const privateKey = await walletStorage.getPrivateKey(address)
      const wallet = Ethers.importWalletByPrivateKey(privateKey)
      const connectedProviderWallet = wallet.connect(provider)
      resolve(connectedProviderWallet)
    } catch (err) {
      reject(err)
    }
  })
}

export const clear = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await walletStorage.clear()
      resolve([])
    } catch (err) {
      reject(err)
    }
  })
}

export const all = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const wallets = await walletStorage.all()
      resolve(wallets)
    } catch (err) {
      reject(err)
    }
  })
}

export const getEthBalance = address => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Ethers.getEthBalance(address)
      const balance = response.data.result
      const formattedBalance = Ethers.formatUnits(balance, 18)
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

      console.log(txHistory)

      const pendingEthPrice = priceService.fetchPriceUsd(
        '0x',
        Config.ETHERSCAN_NETWORK
      )
      const pendingEthBalance = getEthBalance(address)

      const pendingEthToken = fetchEthToken(pendingEthBalance, pendingEthPrice)
      const pendingERC20Tokens = fetchERC20Token(txHistory, provider, address)
      const assets = await Promise.all([pendingEthToken, ...pendingERC20Tokens])
      const updatedBlock = txHistory.slice(-1).pop().blockNumber
      const updatedAssets = {
        address,
        assets,
        updatedBlock,
        updatedAt: Datetime.now()
      }

      resolve(updatedAssets)
    } catch (err) {
      console.log(err)
      reject(new Error(`Cannot fetch assets for address ${address}.`))
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
        contractAddress: '0x',
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

export const importByMnemonic = (mnemonic, provider, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (mnemonic.split(' ').length !== 12) {
        throw 'Invalid mnemonic'
      }

      if (!name) {
        throw 'Wallet name is empty'
      }

      const wallet = Ethers.importWalletByMnemonic(mnemonic)
      const connectedProviderWallet = wallet.connect(provider)

      const privateKey = await connectedProviderWallet.privateKey
      const address = await connectedProviderWallet.address

      await walletStorage.setPrivateKey({ address, privateKey })

      const newWallet = { address, name: name }
      // await walletStorage.add(newWallet)

      resolve(newWallet)
    } catch (err) {
      reject(err)
    }
  })
}

export const setPrimaryAddress = address => {
  return new Promise(async (resolve, reject) => {
    try {
      // await settingStorage.setPrimaryAddress(address)
      resolve(address)
    } catch (err) {
      reject(err)
    }
  })
}

export const getPrimaryAddress = defaultAddress => {
  return new Promise((resolve, reject) => {
    try {
      const primaryAddress = settingStorage.getPrimaryAddress(defaultAddress)
      resolve(primaryAddress)
    } catch (err) {
      reject(err)
    }
  })
}
