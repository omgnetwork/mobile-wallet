import { ethers } from 'ethers'
import { tokenActions } from 'common/actions'
import { ContractABI, BlockchainFormatter, Parser } from 'common/blockchain'
import { ContractAddress } from 'common/constants'
import { Plasma as PlasmaClient } from 'common/clients'
import { priceService } from 'common/services'
import { store } from 'common/stores'
import Config from 'react-native-config'
import includes from 'lodash/includes'

export const find = (contractAddress, tokens) => {
  return tokens.find(token => token.contractAddress === contractAddress)
}

export const hasExitQueue = tokenContractAddress => {
  return PlasmaClient.RootChain.hasToken(tokenContractAddress)
}

export const createExitQueue = async (tokenContractAddress, options) => {
  try {
    const receipt = await PlasmaClient.RootChain.addToken({
      token: tokenContractAddress,
      txOptions: options
    })
    return Promise.resolve(receipt)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const all = (provider, contractAddresses, accountAddress) => {
  const pendingTokenDetails = contractAddresses.map(contractAddress =>
    Promise.all(get(provider, contractAddress, accountAddress))
  )
  return Promise.all(pendingTokenDetails).then(tokens =>
    tokens.reduce(
      (
        tokenMap,
        [tokenName, tokenSymbol, tokenDecimal, price, balance, contractAddress]
      ) => {
        tokenMap[contractAddress] = {
          tokenName,
          tokenSymbol,
          tokenDecimal,
          price,
          balance: BlockchainFormatter.formatUnits(balance, tokenDecimal),
          contractAddress
        }
        return tokenMap
      },
      {}
    )
  )
}

export const get = (provider, contractAddress, accountAddress) => {
  if (contractAddress === ContractAddress.ETH_ADDRESS) {
    return [
      Promise.resolve('Ether'),
      Promise.resolve('ETH'),
      Promise.resolve(18),
      getPrice(contractAddress, Config.ETHEREUM_NETWORK),
      getEthBalance(provider, accountAddress),
      Promise.resolve(contractAddress)
    ]
  } else {
    const contract = new ethers.Contract(
      contractAddress,
      ContractABI.erc20Abi(),
      provider
    )
    const bytes32Contract = new ethers.Contract(
      contractAddress,
      ContractABI.bytes32Erc20Abi(),
      provider
    )
    return [
      getName(contract, bytes32Contract),
      getSymbol(contract, bytes32Contract),
      getDecimals(contract),
      getPrice(contractAddress, Config.ETHEREUM_NETWORK),
      getBalance(contract, accountAddress),
      Promise.resolve(contractAddress)
    ]
  }
}

const getName = (contract, alternativeContract) => {
  return contract
    .name()
    .catch(_ => alternativeContract.name().then(Parser.parseBytes32))
}

const getSymbol = (contract, alternativeContract) => {
  return contract
    .symbol()
    .catch(_ => alternativeContract.symbol().then(Parser.parseBytes32))
}

const getDecimals = contract => {
  return contract.decimals()
}

export const getContractAddressChecksum = contractAddress => {
  return ethers.utils.getAddress(contractAddress)
}

export const getPrice = (contractAddress, chainNetwork) => {
  return priceService.fetchPriceUsd(contractAddress, chainNetwork)
}

const getBalance = (contract, accountAddress) => {
  return contract
    .balanceOf(accountAddress)
    .then(balance => balance.toString(10))
}

const getEthBalance = (provider, address) => {
  return provider.getBalance(address).then(balance => balance.toString(10))
}

export const getContractInfo = async (
  provider,
  tokenContractAddress,
  tokens
) => {
  const cachedInfo = tokens[tokenContractAddress]

  const cachedUnknowns = cachedInfo && includes(cachedInfo, 'UNKNOWN')

  if (cachedInfo && !cachedUnknowns) {
    return cachedInfo
  }

  const contract = new ethers.Contract(
    tokenContractAddress,
    ContractABI.erc20Abi(),
    provider
  )
  const bytes32Contract = new ethers.Contract(
    tokenContractAddress,
    ContractABI.bytes32Erc20Abi(),
    provider
  )

  const pendingName = getName(contract, bytes32Contract).catch(
    _err => 'UNKNOWN'
  )
  const pendingSymbol = getSymbol(contract, bytes32Contract).catch(
    _err => 'UNKNOWN'
  )
  const pendingDecimal = getDecimals(contract, bytes32Contract).catch(
    _err => 'UNKNOWN'
  )

  const [tokenName, tokenSymbol, tokenDecimal] = await Promise.all([
    pendingName,
    pendingSymbol,
    pendingDecimal
  ])

  const tokenContractInfo = { tokenName, tokenSymbol, tokenDecimal }

  tokenActions.addTokenContractInfo(store.dispatch, {
    tokenContractAddress,
    tokenContractInfo
  })

  return tokenContractInfo
}
