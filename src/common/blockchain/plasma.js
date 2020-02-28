import { Plasma, PlasmaUtils, web3 } from 'common/clients'
import { ContractABI, Transaction, Datetime } from 'common/utils'
import axios from 'axios'
import { Gas, ContractAddress } from 'common/constants'
import Config from 'react-native-config'
import BN from 'bn.js'
import { TxOptions } from 'common/blockchain'

const mappingAmount = obj => ({
  ...obj,
  amount: obj.amount.toString(10)
})

export const getBalances = address => {
  return Plasma.ChildChain.getBalance(address).then(balances => {
    return balances.map(mappingAmount)
  })
}

export const getUtxos = (address, options) => {
  const { currency, fromUtxoPos } = options || {}
  const filteringCurrency = utxo => utxo.currency === currency
  const filteringFromUtxoPos = utxo => utxo.utxo_pos >= (fromUtxoPos || 0)
  const sortingUtxoPos = (first, second) => second.utxo_pos - first.utxo_pos

  return Plasma.ChildChain.getUtxos(address)
    .then(utxos => utxos.map(mappingAmount))
    .then(utxos => (currency ? utxos.filter(filteringCurrency) : utxos))
    .then(utxos => utxos.filter(filteringFromUtxoPos))
    .then(utxos => utxos.sort(sortingUtxoPos))
}

export const createPayment = (address, tokenContractAddress, amount) => {
  return [
    {
      owner: address,
      currency: tokenContractAddress,
      amount: new BN(amount)
    }
  ]
}

export const createFee = (currency = PlasmaUtils.transaction.ETH_CURRENCY) => ({
  currency: currency
})

export const deposit = async (
  address,
  privateKey,
  weiAmount,
  tokenContractAddress,
  options = {}
) => {
  const erc20Contract = new web3.eth.Contract(
    ContractABI.erc20Abi(),
    tokenContractAddress
  )
  const depositGas = options.gas || Gas.MEDIUM_LIMIT
  const depositGasPrice = options.gasPrice || Gas.DEPOSIT_GAS_PRICE
  const isEth = tokenContractAddress === ContractAddress.ETH_ADDRESS

  // SEND ERC20 APPROVAL TRANSACTION 👇

  let approveReceipt
  if (!isEth) {
    const {
      address: erc20VaultAddress
    } = await Plasma.RootChain.getErc20Vault()
    const approveOptions = TxOptions.createApproveErc20Options(
      address,
      tokenContractAddress,
      erc20Contract,
      erc20VaultAddress,
      weiAmount,
      depositGas,
      depositGasPrice
    )

    approveReceipt = await approveErc20(approveOptions, privateKey)
  }

  // SEND DEPOSIT TRANSACTION 👇

  const depositOptions = TxOptions.createDepositOptions(
    address,
    privateKey,
    depositGas,
    depositGasPrice
  )

  const receipt = await Plasma.RootChain.deposit({
    amount: weiAmount,
    currency: tokenContractAddress,
    txOptions: depositOptions
  })

  if (approveReceipt) {
    return receiptWithGasPrice(receipt, depositGasPrice, approveReceipt.gasUsed)
  } else {
    return receiptWithGasPrice(receipt, depositGasPrice)
  }
}

const approveErc20 = async (approveOptions, ownerPrivateKey) => {
  const signedApproveTx = await web3.eth.accounts.signTransaction(
    approveOptions,
    ownerPrivateKey
  )

  return web3.eth.sendSignedTransaction(signedApproveTx.rawTransaction)
}

const receiptWithGasPrice = (txReceipt, gasPrice, additionalGasUsed = 0) => {
  return {
    hash: txReceipt.transactionHash,
    from: txReceipt.from,
    to: txReceipt.to,
    blockNumber: txReceipt.blockNumber,
    blockHash: txReceipt.blockHash,
    gasUsed: txReceipt.gasUsed + additionalGasUsed,
    gasPrice: gasPrice
  }
}

export const standardExit = (exitData, blockchainWallet, options) => {
  return Plasma.RootChain.startStandardExit({
    utxoPos: exitData.utxo_pos,
    outputTx: exitData.txbytes,
    inclusionProof: exitData.proof,
    txOptions: {
      privateKey: blockchainWallet.privateKey,
      from: blockchainWallet.address,
      gas: options.gasLimit || Gas.HIGH_LIMIT,
      gasPrice: options.gasPrice || Gas.EXIT_GAS_PRICE
    }
  })
}

export const getExitTxDetails = async (exitTx, { from, gas, gasPrice }) => {
  const { utxo_pos, txbytes, proof } = exitTx
  const {
    contract,
    address,
    bonds
  } = await Plasma.RootChain.getPaymentExitGame()
  const data = getTxData(contract, 'startStandardExit', [
    utxo_pos.toString(),
    txbytes,
    proof
  ])
  const value = bonds.standardExit
  return {
    from,
    to: address,
    value,
    data,
    gas,
    gasPrice
  }
}

const getTxData = (contract, method, ...args) => {
  if (web3.version.api && web3.version.api.startsWith('0.2')) {
    return contract[method].getData(...args)
  } else {
    return contract.methods[method](...args).encodeABI()
  }
}

export const getProcessExitAt = createdAt => {
  return Datetime.add(Datetime.fromString(createdAt), Config.EXIT_PERIOD * 2)
}

export const waitForRootchainTransaction = ({
  hash,
  intervalMs,
  confirmationThreshold,
  onCountdown = remaining => {}
}) => {
  return PlasmaUtils.waitForRootchainTransaction({
    web3,
    transactionHash: hash,
    checkIntervalMs: intervalMs,
    blocksToWait: confirmationThreshold,
    onCountdown: onCountdown
  })
}

export const getPaymentExitGameAddress = () => {
  return Plasma.RootChain.getPaymentExitGame()
}

export const getErrorReason = async hash => {
  try {
    return await PlasmaUtils.ethErrorReason({ web3, hash }).catch()
  } catch (e) {
    console.log(e)
    return 'Cannot retrieve error reason'
  }
}

export const isDepositUtxo = utxo => {
  return utxo.blknum % 1000 !== 0
}

export const getStandardExitId = (utxoToExit, exitData) => {
  return Plasma.RootChain.getStandardExitId({
    txBytes: exitData.txbytes,
    utxoPos: exitData.utxo_pos,
    isDeposit: isDepositUtxo(utxoToExit)
  })
}

export const hasToken = tokenContractAddress => {
  return Plasma.RootChain.hasToken(tokenContractAddress)
}

export const addToken = async (tokenContractAddress, options) => {
  try {
    const receipt = await Plasma.RootChain.addToken({
      token: tokenContractAddress,
      txOptions: options
    })
    return Promise.resolve(receipt)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const processExits = (
  contractAddress,
  exitId,
  maxExitsToProcess,
  txOptions
) => {
  return Plasma.RootChain.processExits({
    token: contractAddress,
    exitId: exitId || 0,
    maxExitsToProcess: maxExitsToProcess,
    txOptions
  })
}

// Transaction management
export const createTx = (fromAddress, payments, fee, metadata) => {
  const encodedMetadata =
    (metadata && Transaction.encodeMetadata(metadata)) ||
    PlasmaUtils.transaction.NULL_METADATA

  return Plasma.ChildChain.createTransaction({
    owner: fromAddress,
    payments,
    fee,
    metadata: encodedMetadata
  })
}

export const createAcceptableUtxoParams = ({
  amount,
  blknum,
  currency,
  oindex,
  owner,
  txindex,
  utxo_pos
}) => {
  return {
    amount,
    blknum,
    currency,
    oindex,
    owner,
    txindex,
    utxo_pos
  }
}

export const getTypedData = tx => {
  return PlasmaUtils.transaction.getTypedData(
    tx,
    Plasma.RootChain.plasmaContractAddress
  )
}

export const getExitData = utxo => {
  return Plasma.ChildChain.getExitData(utxo)
}

export const getExitQueue = async tokenContractAddress => {
  const queue = await Plasma.RootChain.getExitQueue(tokenContractAddress)
  return {
    tokenContractAddress,
    queue: queue.map(q => ({
      ...q,
      tokenContractAddress
    }))
  }
}

export const signTx = (typedData, privateKeys) => {
  return Plasma.ChildChain.signTransaction(typedData, privateKeys)
}

export const buildSignedTx = (typedData, signatures) => {
  return Plasma.ChildChain.buildSignedTransaction(typedData, signatures)
}

export const submitTx = signedTx => {
  return Plasma.ChildChain.submitTransaction(signedTx)
}

export const getTxs = (address, options) => {
  const { blknum, limit } = options || { blknum: '0', limit: 10 }
  return Plasma.ChildChain.getTransactions({
    address: address,
    limit: limit || 10,
    page: 1
  })
}

export const getTx = hash => {
  return Plasma.ChildChain.getTransaction(hash)
}

export const getFees = (currencies = []) => {
  return axios
    .post(`${Config.CHILDCHAIN_WATCHER_URL}fees.all`, {
      params: {
        currencies,
        tx_types: []
      }
    })
    .then(response => {
      return response.data.data['1'].filter(
        fee => currencies.indexOf(fee.currency) > -1
      )
    })
}
