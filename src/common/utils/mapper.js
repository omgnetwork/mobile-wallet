import { ContractAddress } from 'common/constants'
import { Transaction, Token } from 'common/utils'
import { TransactionTypes } from 'common/constants'
import BigNumber from 'bignumber.js'

export const mapChildchainTx = (tx, tokens, address) => {
  const sentToken = mapChildchainOutput(tx.results)
  const contractAddress = sentToken.currency
  const token = Token.find(contractAddress, tokens)
  return {
    hash: tx.txhash,
    network: 'omisego',
    confirmations: null,
    type: mapTransactionType(tx, address),
    from: tx.from,
    to: tx.to,
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

export const mapChildchainTxDetail = (oldTx, newTx) => {
  const fromAddress = newTx.inputs[0].owner
  const targetUtxo =
    newTx.outputs.find(utxo => utxo.owner !== fromAddress) || newTx.outputs[0]
  const toAddress = targetUtxo.owner

  const accumulateEthAmount = (acc, input) => {
    if (input.currency === ContractAddress.ETH_ADDRESS) {
      return acc.plus(input.amount)
    } else {
      return acc
    }
  }
  const totalEthInput = newTx.inputs.reduce(
    accumulateEthAmount,
    new BigNumber(0)
  )
  const totalEthOutput = newTx.outputs.reduce(
    accumulateEthAmount,
    new BigNumber(0)
  )
  const gasPrice = totalEthInput.minus(totalEthOutput).toString(10)

  return {
    ...oldTx,
    contractAddress: targetUtxo.currency,
    from: fromAddress,
    to: toAddress,
    gasUsed: 1,
    gasPrice: gasPrice,
    value:
      typeof targetUtxo.amount === 'string'
        ? targetUtxo.amount
        : targetUtxo.amount.toFixed()
  }
}

export const mapRootchainTx = (tx, address, cachedErc20Tx) => {
  const erc20Tx = cachedErc20Tx[tx.hash]
  if (erc20Tx) {
    return mapRootchainErc20Tx(erc20Tx, address)
  } else {
    return mapRootchainEthTx(tx, address)
  }
}

export const mapTxCurrency = tx => {
  const usedCurrency = tx.results[tx.results.length - 1]
  return usedCurrency.currency
}

export const mapAssetCurrency = asset => asset.currency

const mapRootchainEthTx = (tx, address) => {
  return {
    hash: tx.hash,
    network: 'ethereum',
    type: mapTransactionType(tx, address),
    confirmations: tx.confirmations,
    from: tx.from,
    to: tx.to,
    gasLimit: tx.gasLimit,
    gasUsed: tx.gasUsed,
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
    type: mapTransactionType(tx, address),
    confirmations: tx.confirmations,
    from: tx.from,
    to: tx.to,
    gas: tx.gas,
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    contractAddress: tx.contractAddress,
    tokenName: tx.tokenName,
    tokenSymbol: tx.tokenSymbol,
    tokenDecimal: tx.tokenDecimal,
    value: typeof tx.value === 'string' ? tx.value : tx.value.toFixed(),
    timestamp: tx.timeStamp
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

const mapTransactionType = (tx, address) => {
  const methodName = Transaction.decodePlasmaInputMethod(tx.input)

  if (tx.isError === '1') return TransactionTypes.TYPE_FAILED
  if (!tx.from) return TransactionTypes.TYPE_UNIDENTIFIED
  if (!tx.to) return TransactionTypes.TYPE_UNIDENTIFIED
  switch (methodName) {
    case 'depositFrom':
    case 'deposit':
      return TransactionTypes.TYPE_DEPOSIT
    case 'approve':
      return 'depositApprove'
    case 'addToken':
      return 'unlockExit'
    case 'startStandardExit':
      return TransactionTypes.TYPE_EXIT
    default:
      if (Transaction.isReceiveTx(address, tx.to)) {
        return TransactionTypes.TYPE_RECEIVED
      } else {
        return TransactionTypes.TYPE_SENT
      }
  }
}
