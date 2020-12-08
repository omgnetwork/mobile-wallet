import Web3 from 'web3'
import {
  ContractABI,
  BlockchainFormatter,
  Parser,
  TxDetails,
  Ethereum,
  Wait
} from 'common/blockchain'
import { ContractAddress } from 'common/constants'
import { Plasma as PlasmaClient } from 'common/clients'
import { priceService } from 'common/services'
import Config from 'react-native-config'

export const find = (contractAddress, tokens) => {
  return tokens.find(token => token.contractAddress === contractAddress)
}

export const hasExitQueue = ({ smallestUnitAmount }) => {
  const { token } = smallestUnitAmount
  return PlasmaClient.RootChain.hasToken(token.contractAddress)
}

export const createExitQueue = async ({
  smallestUnitAmount,
  gasOptions,
  addresses,
  privateKey
}) => {
  const txDetails = await TxDetails.getCreateExitQueue({
    smallestUnitAmount,
    gasOptions,
    addresses
  })

  const { hash } = await Ethereum.signSendTx(txDetails, privateKey)

  await Wait.waitForRootchainTransaction({
    hash,
    intervalMs: 3000,
    confirmationThreshold: 1
  })

  return { hash }
}

export const all = (contractAddresses, accountAddress) => {
  const pendingTokenDetails = contractAddresses.map(contractAddress =>
    Promise.all(get(contractAddress, accountAddress))
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

export const get = (contractAddress, accountAddress) => {
  const provider = new Web3.providers.HttpProvider(Config.WEB3_HTTP_PROVIDER)
  const web3 = new Web3(provider, null)
  if (contractAddress === ContractAddress.ETH_ADDRESS) {
    return [
      Promise.resolve('Ether'),
      Promise.resolve('ETH'),
      Promise.resolve(18),
      getPrice(contractAddress, Config.ETHEREUM_NETWORK),
      getEthBalance(accountAddress),
      Promise.resolve(contractAddress)
    ]
  } else {
    const contract = new web3.eth.Contract(
      ContractABI.erc20Abi(),
      contractAddress,
      { from: accountAddress }
    )
    const bytes32Contract = new web3.eth.Contract(
      ContractABI.bytes32Erc20Abi(),
      contractAddress,
      { from: accountAddress }
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
  return contract.methods
    .name()
    .call()
    .catch(_ =>
      alternativeContract.methods.name().call().then(Parser.parseBytes32)
    )
}

const getSymbol = (contract, alternativeContract) => {
  return contract.methods
    .symbol()
    .call()
    .catch(_ =>
      alternativeContract.methods.symbol().call().then(Parser.parseBytes32)
    )
}

const getDecimals = contract => {
  return contract.methods.decimals().call()
}

export const getContractAddressChecksum = contractAddress => {
  return Web3.utils.toChecksumAddress(contractAddress)
}

export const getPrice = (contractAddress, chainNetwork) => {
  return priceService.fetchPriceUsd(contractAddress, chainNetwork)
}

const getBalance = (contract, accountAddress) => {
  return contract.methods
    .balanceOf(accountAddress)
    .call({ from: accountAddress })
    .then(balance => balance.toString(10))
}

const getEthBalance = address => {
  const provider = new Web3.providers.HttpProvider(Config.WEB3_HTTP_PROVIDER)
  return new Web3(provider).eth
    .getBalance(address)
    .then(balance => balance.toString(10))
}
