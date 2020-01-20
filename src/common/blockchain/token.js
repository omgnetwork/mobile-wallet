import { ethers } from 'ethers'
import { Parser, ContractABI, Formatter } from 'common/utils'
import { ContractAddress } from 'common/constants/'
import { priceService } from 'common/services'
import Config from 'react-native-config'

export const find = (contractAddress, tokens) => {
  return tokens.find(token => token.contractAddress === contractAddress)
}

export const fetchTokens = (provider, contractAddresses, accountAddress) => {
  const pendingTokenDetails = contractAddresses.map(contractAddress =>
    Promise.all(fetchTokenDetail(provider, contractAddress, accountAddress))
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
          balance: Formatter.formatUnits(balance, tokenDecimal),
          contractAddress
        }
        return tokenMap
      },
      {}
    )
  )
}

export const fetchTokenDetail = (provider, contractAddress, accountAddress) => {
  if (contractAddress === ContractAddress.ETH_ADDRESS) {
    return [
      Promise.resolve('Ether'),
      Promise.resolve('ETH'),
      Promise.resolve(18),
      fetchPrice(contractAddress, Config.ETHERSCAN_NETWORK),
      fetchEthBalance(provider, accountAddress),
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
      fetchName(contract, bytes32Contract),
      fetchSymbol(contract, bytes32Contract),
      fetchDecimals(contract),
      fetchPrice(contractAddress, Config.ETHERSCAN_NETWORK),
      fetchBalance(contract, accountAddress),
      Promise.resolve(contractAddress)
    ]
  }
}

const fetchName = (contract, alternativeContract) => {
  return contract
    .name()
    .catch(_ => alternativeContract.name().then(Parser.parseBytes32))
}

const fetchSymbol = (contract, alternativeContract) => {
  return contract
    .symbol()
    .catch(_ => alternativeContract.symbol().then(Parser.parseBytes32))
}

const fetchDecimals = contract => {
  return contract.decimals()
}

export const getContractAddressChecksum = contractAddress => {
  return ethers.utils.getAddress(contractAddress)
}

const fetchPrice = (contractAddress, chainNetwork) => {
  return priceService.fetchPriceUsd(contractAddress, chainNetwork)
}

const fetchBalance = (contract, accountAddress) => {
  return contract
    .balanceOf(accountAddress)
    .then(balance => balance.toString(10))
}

const fetchEthBalance = (provider, address) => {
  return provider.getBalance(address)
}
