import { ContractAddress } from 'common/constants'
import { Transaction, Token } from 'common/utils'

export const mapChildchainTx = (tx, address, tokens) => {
  const direction = Transaction.getDirection(address, tx.metadata)
  // Assume ERC20 transfer
  if (tx.results.length > 1) {
    return mapChildchainErc20Tx(direction, tx, tokens)
  } else {
    return mapChildchainEthTx(direction, tx)
  }
}

export const mapRootchainTx = (tx, cachedErc20Tx) => {
  const erc20Tx = cachedErc20Tx[tx.hash]
  if (erc20Tx) {
    return mapRootchainErc20Tx(erc20Tx)
  } else {
    return mapRootchainEthTx(tx)
  }
}

const mapRootchainEthTx = tx => {
  return {
    hash: tx.hash,
    network: 'ethereum',
    confirmations: tx.confirmations,
    from: tx.from,
    to: tx.to,
    contractAddress: ContractAddress.ETH_ADDRESS,
    tokenName: 'Ether',
    tokenSymbol: 'ETH',
    tokenDecimal: '18',
    value: tx.value,
    timestamp: tx.timeStamp
  }
}

const mapRootchainErc20Tx = tx => {
  return {
    hash: tx.hash,
    network: 'ethereum',
    confirmations: tx.confirmations,
    from: tx.from,
    to: tx.to,
    contractAddress: tx.contractAddress,
    tokenName: tx.tokenName,
    tokenSymbol: tx.tokenSymbol,
    tokenDecimal: tx.tokenDecimal,
    value: tx.value,
    timestamp: tx.timeStamp
  }
}

const mapChildchainEthTx = (direction, tx) => {
  return {
    hash: tx.txhash,
    network: 'omisego',
    confirmations: '',
    from: direction.from,
    to: direction.to,
    contractAddress: ContractAddress.ETH_ADDRESS,
    tokenName: 'Ether',
    tokenSymbol: 'ETH',
    tokenDecimal: 18,
    value: tx.results[0].value,
    timestamp: tx.block.timestamp
  }
}

const mapChildchainErc20Tx = (direction, tx, tokens) => {
  const usedToken = tx.results[tx.results.length - 1]
  const contractAddress = usedToken.currency
  const token = Token.find(contractAddress, tokens)
  return {
    hash: tx.txhash,
    network: 'omisego',
    confirmations: '',
    from: direction.from,
    to: direction.to,
    contractAddress,
    tokenName: token.tokenName,
    tokenSymbol: token.tokenSymbol,
    tokenDecimal: token.tokenDecimal,
    value: usedToken.value,
    timestamp: tx.block.timestamp
  }
}

export const mapCurrency = tx => {
  const usedCurrency = tx.results[tx.results.length - 1]
  return usedCurrency.currency
}
