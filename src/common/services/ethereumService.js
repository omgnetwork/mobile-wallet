import { ContractAddress } from 'common/constants'
import { Datetime, Unit } from 'common/utils'
import { Ethereum, Token } from 'common/blockchain'
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

export const sendErc20Token = async sendTransactionParams => {
  const { token, amount } = sendTransactionParams.smallestUnitAmount
  const { hash } = await Ethereum.sendErc20Token(sendTransactionParams)

  return {
    hash,
    value: Unit.convertToString(amount, token.tokenDecimal, 0)
  }
}

export const sendEthToken = async sendTransactionParams => {
  const { token, amount } = sendTransactionParams.smallestUnitAmount
  const { hash } = await Ethereum.sendEthToken(sendTransactionParams)

  return {
    hash,
    value: Unit.convertToString(amount, token.tokenDecimal, 0)
  }
}

export const isRequireApproveErc20 = sendTransactionParams => {
  return Ethereum.isRequireApproveErc20(sendTransactionParams)
}

export const approveErc20Deposit = async sendTransactionParams => {
  const { token, amount } = sendTransactionParams.smallestUnitAmount
  const { hash } = await Ethereum.approveErc20Deposit(sendTransactionParams)
  return {
    hash,
    value: Unit.convertToString(amount, token.tokenDecimal, 0)
  }
}

export const getRecommendedGas = () => {
  return Ethereum.getGasFromGasStation().then(
    ({ fast, average, safeLow, fastWait, avgWait, safeLowWait }) => [
      {
        speed: 'Express',
        estimateTime: `${fastWait * 60} seconds`,
        currency: ContractAddress.ETH_ADDRESS,
        amount: Unit.convertToString(fast, 10, 18),
        displayAmount: fast / 10,
        symbol: 'Gwei',
        price: '1'
      },
      {
        speed: 'Standard',
        estimateTime: `${avgWait * 60} seconds`,
        amount: Unit.convertToString(average, 10, 18),
        displayAmount: average / 10,
        currency: ContractAddress.ETH_ADDRESS,
        symbol: 'Gwei',
        price: '1'
      },
      {
        speed: 'Low-Priority',
        estimateTime: `${safeLowWait * 60} seconds`,
        amount: Unit.convertToString(safeLow, 10, 18),
        displayAmount: safeLow / 10,
        currency: ContractAddress.ETH_ADDRESS,
        symbol: 'Gwei',
        price: '1'
      }
    ]
  )
}

export const getTxs = async (address, options, onlyErc20) => {
  const response = onlyErc20
    ? await Ethereum.getERC20Txs(address, options)
    : await Ethereum.getTxs(address, options)
  return response.data.result
}

export const getInternalTxs = async (address, options) => {
  const response = await Ethereum.getInternalTxs(address, options)
  const internalTxs = response.data.result
  return internalTxs
}
