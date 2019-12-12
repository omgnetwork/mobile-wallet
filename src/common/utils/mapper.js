import { ContractAddress } from 'common/constants'
import { Transaction, Token } from 'common/utils'
import { TransactionTypes, BlockchainNetworkType } from 'common/constants'
import BigNumber from 'bignumber.js'

export const mapChildchainTx = (tx, tokens, walletAddress) => {
  const input = mapInputTransfer(tx)
  const output = mapOutputTransfer(input, tx.outputs)
  const contractAddress = output.currency
  const token = Token.find(contractAddress, tokens)
  return {
    hash: tx.txhash,
    network: BlockchainNetworkType.TYPE_OMISEGO_NETWORK,
    confirmations: null,
    type: mapChildchainTransactionType(output, walletAddress),
    from: input.owner,
    to: output.owner,
    gasUsed: 1,
    gasPrice: '0',
    contractAddress,
    tokenName: token.tokenName,
    tokenSymbol: token.tokenSymbol,
    tokenDecimal: token.tokenDecimal,
    value:
      typeof output.amount === 'string'
        ? output.amount
        : output.amount.toFixed(),
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

export const mapInputTransfer = tx => {
  return tx.inputs.length === 1
    ? tx.inputs[0]
    : tx.inputs.find(input => !isInputGreaterThanOutput(input, tx.outputs))
}

export const mapOutputTransfer = (inputTransfer, outputs) => {
  return outputs.find(output => output.owner !== inputTransfer.owner)
}

export const mapInputFee = tx => {
  return tx.inputs.find(input => isInputGreaterThanOutput(input, tx.outputs))
}

const isInputGreaterThanOutput = (input, outputs) => {
  const accumulateOutputAmount = outs =>
    outs.reduce((acc, output) => acc.plus(output.amount), new BigNumber(0))

  const sameCurrencyOutputs = outputs.filter(
    output => output.currency === input.currency
  )
  const totalOutputAmount = accumulateOutputAmount(sameCurrencyOutputs)
  return input.amount.gt(totalOutputAmount)
}

export const mapAssetCurrency = asset => asset.currency

const mapRootchainEthTx = (tx, address) => {
  return {
    hash: tx.hash,
    network: BlockchainNetworkType.TYPE_ETHEREUM_NETWORK,
    type: mapRootchainTransactionType(tx, address),
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
    network: BlockchainNetworkType.TYPE_ETHEREUM_NETWORK,
    type: mapRootchainTransactionType(tx, address),
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

const mapRootchainTransactionType = (tx, address) => {
  const methodName = Transaction.decodePlasmaInputMethod(tx.input)
  if (tx.isError === '1') {
    return TransactionTypes.TYPE_FAILED
  }
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

const mapChildchainTransactionType = (output, address) => {
  if (Transaction.isReceiveTx(address, output.owner)) {
    return TransactionTypes.TYPE_RECEIVED
  } else {
    return TransactionTypes.TYPE_SENT
  }
}
