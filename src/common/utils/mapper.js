import { ContractAddress } from 'common/constants'
import { Transaction, Token } from 'common/utils'

export const mapChildchainTx = (tx, tokens) => {
  return mapChildchainToken(tx, tokens)
}

export const mapRootchainTx = (tx, address, cachedErc20Tx) => {
  const erc20Tx = cachedErc20Tx[tx.hash]
  if (erc20Tx) {
    return mapRootchainErc20Tx(erc20Tx, address)
  } else {
    return mapRootchainEthTx(tx, address)
  }
}

export const mapCurrency = tx => {
  const usedCurrency = tx.results[tx.results.length - 1]
  return usedCurrency.currency
}

const mapRootchainEthTx = (tx, address) => {
  return {
    hash: tx.hash,
    network: 'ethereum',
    type: mapInput(tx, address),
    confirmations: tx.confirmations,
    from: tx.from,
    to: tx.to,
    gas: tx.gas,
    gasPrice: tx.gasPrice,
    contractAddress: ContractAddress.ETH_ADDRESS,
    tokenName: 'Ether',
    tokenSymbol: 'ETH',
    tokenDecimal: '18',
    value: typeof tx.value === 'string' ? tx.value : tx.value.toFixed(),
    timestamp: tx.timeStamp
  }
}

const mapRootchainErc20Tx = (tx, address) => {
  return {
    hash: tx.hash,
    network: 'ethereum',
    type: mapInput(tx, address),
    confirmations: tx.confirmations,
    from: tx.from,
    to: tx.to,
    gas: tx.gas,
    gasPrice: tx.gasPrice,
    contractAddress: tx.contractAddress,
    tokenName: tx.tokenName,
    tokenSymbol: tx.tokenSymbol,
    tokenDecimal: tx.tokenDecimal,
    value: typeof tx.value === 'string' ? tx.value : tx.value.toFixed(),
    timestamp: tx.timeStamp
  }
}

const mapChildchainToken = (tx, tokens) => {
  const sentToken = mapChildchainOutput(tx.results)
  const contractAddress = sentToken.currency
  const token = Token.find(contractAddress, tokens)
  return {
    hash: tx.txhash,
    network: 'omisego',
    confirmations: null,
    type: 'out',
    from: null,
    to: null,
    gas: '0',
    gasPrice: '0',
    contractAddress,
    tokenName: token.tokenName,
    tokenSymbol: token.tokenSymbol,
    tokenDecimal: token.tokenDecimal,
    value:
      typeof sentToken.value === 'string'
        ? sentToken.value
        : sentToken.value.toFixed(),
    timestamp: tx.block.timestamp
  }
}

const mapChildchainOutput = results => {
  const erc20Token = results
    .reverse()
    .find(result => result.currency !== ContractAddress.ETH_ADDRESS)
  if (erc20Token) {
    return erc20Token
  } else {
    return results[0]
  }
}

const mapInput = (tx, address) => {
  const methodName = Transaction.decodePlasmaInputMethod(tx.input)

  if (tx.isError === '1') return 'failed'
  switch (methodName) {
    case 'depositFrom':
    case 'deposit':
      return 'deposit'
    case 'approve':
      return 'depositApprove'
    case 'addToken':
      return 'unlockExit'
    case 'startStandardExit':
      return 'exit'
    default:
      if (Transaction.isReceiveTx(address, tx.to)) {
        return 'in'
      } else {
        return 'out'
      }
  }
}