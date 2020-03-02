import { ContractAddress } from 'common/constants'
import { Token } from 'common/blockchain'
import { Transaction, Datetime, BigNumber } from 'common/utils'
import { TransactionTypes, BlockchainNetworkType } from 'common/constants'
import BN from 'bn.js'

export const mapChildchainTx = (tx, tokens, walletAddress) => {
  const input = mapInputTransfer(tx)
  const output = mapOutputTransfer(input, tx.outputs)
  const contractAddress = output.currency
  const token = Token.find(contractAddress, tokens)
  const feeCurrency = getFeeCurrency(tx)
  const feeAmount = getFeeAmount(tx, feeCurrency)
  return {
    hash: tx.txhash,
    network: BlockchainNetworkType.TYPE_OMISEGO_NETWORK,
    confirmations: null,
    type: mapChildchainTransactionType(output, walletAddress),
    from: input.owner,
    to: output.owner,
    gasUsed: feeAmount,
    gasPrice: '1',
    gasCurrency: feeCurrency,
    contractAddress,
    tokenName: token.tokenName,
    tokenSymbol: token.tokenSymbol,
    tokenDecimal: token.tokenDecimal,
    value:
      typeof output.amount === 'string'
        ? output.amount
        : output.amount.toString(10),
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
  const totalEthInput = newTx.inputs.reduce(accumulateEthAmount, new BN(0))
  const totalEthOutput = newTx.outputs.reduce(accumulateEthAmount, new BN(0))
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

export const mapRootchainTx = (
  tx,
  address,
  erc20TxMap,
  standardExitBondSize
) => {
  const erc20Tx = erc20TxMap[tx.hash]
  if (erc20Tx) {
    return mapRootchainErc20Tx(erc20Tx, address)
  } else {
    return mapRootchainEthTx(tx, address, standardExitBondSize)
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

export const getFeeCurrency = tx => {
  return tx.inputs.find(input => isInputGreaterThanOutput(input, tx.outputs))
    ?.currency
}

export const getFeeAmount = (tx, feeCurrency) => {
  const totalOutputAmount = tx.outputs
    .filter(output => output.currency === feeCurrency)
    .reduce((acc, output) => BigNumber.plus(acc, output.amount), 0)

  const totalInputAmount = tx.inputs
    .filter(input => input.currency === feeCurrency)
    .reduce((acc, input) => BigNumber.plus(acc, input.amount), 0)

  return BigNumber.minus(totalInputAmount, totalOutputAmount)
}

const isInputGreaterThanOutput = (input, outputs) => {
  const accumulateOutputAmount = outs =>
    outs.reduce(
      (acc, output) => acc.add(new BN(output.amount)),
      new BN('0', 10)
    )

  const sameCurrencyOutputs = outputs.filter(
    output => output.currency === input.currency
  )
  const totalOutputAmount = accumulateOutputAmount(sameCurrencyOutputs)
  return new BN(input.amount).gt(totalOutputAmount)
}

export const mapAssetCurrency = asset => asset.currency

export const mapRootchainEthTx = (tx, address, standardExitBondSize) => {
  return {
    hash: tx.hash,
    network: BlockchainNetworkType.TYPE_ETHEREUM_NETWORK,
    type: mapRootchainTransactionType(tx, address, standardExitBondSize),
    confirmations: tx.confirmations,
    from: tx.from,
    to: tx.to,
    gasLimit: tx.gasLimit || tx.gas,
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice || 0,
    gasCurrency: ContractAddress.ETH_ADDRESS,
    contractAddress: ContractAddress.ETH_ADDRESS,
    tokenName: 'Ether',
    tokenSymbol: 'ETH',
    tokenDecimal: '18',
    value: typeof tx.value === 'string' ? tx.value : tx.value.toFixed(),
    timestamp: tx.timeStamp
  }
}

export const mapRootchainErc20Tx = (tx, address) => {
  return {
    hash: tx.hash,
    network: BlockchainNetworkType.TYPE_ETHEREUM_NETWORK,
    type: mapRootchainTransactionType(tx, address),
    confirmations: tx.confirmations,
    from: tx.from,
    to: tx.to,
    gas: tx.gas || tx.gas,
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice || 0,
    gasCurrency: ContractAddress.ETH_ADDRESS,
    contractAddress: tx.contractAddress,
    tokenName: tx.tokenName,
    tokenSymbol: tx.tokenSymbol,
    tokenDecimal: tx.tokenDecimal,
    value: typeof tx.value === 'string' ? tx.value : tx.value.toFixed(),
    timestamp: tx.timeStamp
  }
}

export const mapStartedExitTx = tx => {
  return {
    ...tx,
    gasUsed: tx.gasUsed.toString(),
    value: tx.smallestValue,
    tokenSymbol: tx.symbol.toString(),
    timestamp: Datetime.toTimestamp(tx.startedExitAt)
  }
}

const mapRootchainTransactionType = (tx, address, standardExitBondSize) => {
  const methodName = Transaction.decodePlasmaInputMethod(tx.input)
  if (tx.isError === '1') {
    return TransactionTypes.TYPE_FAILED
  }
  switch (methodName) {
    case 'depositFrom':
    case 'deposit':
      return TransactionTypes.TYPE_DEPOSIT
    case 'approve':
      return TransactionTypes.TYPE_APPROVE_ERC20
    case 'addToken':
      return TransactionTypes.TYPE_PLASMA_ADD_TOKEN
    default:
      if (Transaction.isPlasmaCallTx(tx, standardExitBondSize)) {
        return TransactionTypes.TYPE_UNIDENTIFIED
      } else if (Transaction.isReceiveTx(address, tx.to)) {
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
