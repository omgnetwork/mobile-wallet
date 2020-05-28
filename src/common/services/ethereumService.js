import { Ethereum, Token, ContractABI, Parser } from 'common/blockchain'
import { ContractAddress } from 'common/constants'
import { Datetime } from 'common/utils'
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

    const tokens = await Token.all(
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

export const getRecommendedGas = () => {
  return Ethereum.getGasFromGasStation().then(
    ({ fast, average, safeLow, fastWait, avgWait, safeLowWait }) => [
      {
        speed: 'Express',
        estimateTime: `${fastWait * 60} seconds`,
        amount: Parser.parseUnits(fast.toString(), 8).toString(10),
        displayAmount: fast / 10,
        symbol: 'Gwei',
        price: '1'
      },
      {
        speed: 'Standard',
        estimateTime: `${avgWait * 60} seconds`,
        amount: Parser.parseUnits(average.toString(), 8).toString(10),
        displayAmount: average / 10,
        symbol: 'Gwei',
        price: '1'
      },
      {
        speed: 'Low-Priority',
        estimateTime: `${safeLowWait * 60} seconds`,
        amount: Parser.parseUnits(safeLow.toString(), 8).toString(10),
        displayAmount: safeLow / 10,
        symbol: 'Gwei',
        price: '1'
      }
    ]
  )
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

export const getInternalTxs = async (address, options) => {
  const response = await Ethereum.getInternalTxs(address, options)
  const internalTxs = response.data.result
  return internalTxs
}
