import { Plasma, PlasmaUtils, web3 } from 'common/clients'
import { ContractABI, Transaction, Wait } from 'common/utils'
import axios from 'axios'
import { Gas, ContractAddress } from 'common/constants'
import Config from 'react-native-config'
import BN from 'bn.js'
import { TxOptions, Contract } from 'common/blockchain'

const mappingAmount = obj => ({
  ...obj,
  amount: obj.amount.toString(10)
})

export let standardExitBond

export const getBalances = address => {
  return Plasma.ChildChain.getBalance(address).then(balances => {
    return balances.map(mappingAmount)
  })
}

export const getUtxos = (address, options) => {
  const { currency, fromUtxoPos, sort } = options || {}

  const filteringCurrency = utxo => utxo.currency === currency
  const filteringFromUtxoPos = utxo => utxo.utxo_pos >= (fromUtxoPos || 0)
  const sortingUtxoPos = (first, second) => second.utxo_pos - first.utxo_pos
  return Plasma.ChildChain.getUtxos(address)
    .then(utxos => utxos.map(mappingAmount))
    .then(utxos => (currency ? utxos.filter(filteringCurrency) : utxos))
    .then(utxos => utxos.filter(filteringFromUtxoPos))
    .then(utxos => utxos.sort(sort || sortingUtxoPos))
}

export const getRequiredMergeUtxos = async (
  address,
  unsubmittedBlknum,
  maximumUtxosPerCurrency = 4
) => {
  if (unsubmittedBlknum) {
    await Wait.waitChildChainBlknum(address, unsubmittedBlknum)
  }

  return getUtxos(address)
    .then(utxos => {
      return utxos.reduce((acc, utxo) => {
        const { currency } = utxo
        if (!acc[currency]) {
          acc[currency] = []
        }
        acc[currency].push(utxo)
        return acc
      }, {})
    })
    .then(map =>
      Object.keys(map)
        .filter(key => map[key].length > maximumUtxosPerCurrency)
        .map(key => map[key])
    )
}

export const mergeListOfUtxos = async (
  address,
  privateKey,
  maximumUtxosPerCurrency = 4,
  listOfUtxos,
  storeBlknum = () => {}
) => {
  const pendingMergeUtxos = listOfUtxos.map(utxos =>
    mergeUtxosUntilThreshold(
      address,
      privateKey,
      maximumUtxosPerCurrency,
      utxos,
      storeBlknum
    )
  )
  return Promise.all(pendingMergeUtxos)
}

export const mergeUtxos = async (address, privateKey, utxos) => {
  const _metadata = 'Merge UTXOs'
  const { currency } = utxos[0]
  const totalAmount = utxos.reduce((sum, utxo) => {
    return sum.add(new BN(utxo.amount))
  }, new BN(0))
  const payments = createPayment(address, currency, totalAmount)
  const fee = { ...createFee(), amount: 0 }
  const txBody = createTransactionBody({
    fromAddress: address,
    fromUtxos: utxos,
    payments,
    fee,
    metadata: Transaction.encodeMetadata(_metadata)
  })
  const typedData = getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(privateKey)
  const signatures = signTx(typedData, privateKeys)
  const signedTxn = buildSignedTx(typedData, signatures)
  return submitTx(signedTxn)
}

export const mergeUtxosUntilThreshold = async (
  address,
  privateKey,
  maximumUtxosPerCurrency,
  utxos,
  storeBlknum
) => {
  if (utxos.length <= maximumUtxosPerCurrency) {
    const blknum = utxos[0].blknum
    return {
      blknum,
      utxos
    }
  }

  let listOfUtxosGroup = []
  let utxosGroup = []
  for (let i = 0; i < utxos.length; i++) {
    utxosGroup.push(utxos[i])
    if (
      utxosGroup.length === 4 ||
      (i === utxos.length - 1 && utxosGroup.length > 1)
    ) {
      listOfUtxosGroup.push(utxosGroup)
      utxosGroup = []
    }
  }

  const pendingTxs = listOfUtxosGroup.map(groupOfUtxos =>
    mergeUtxos(address, privateKey, groupOfUtxos)
  )

  const receipts = await Promise.all(pendingTxs)
  const { blknum } = receipts.sort((a, b) => b.blknum - a.blknum)[0]

  // Store blknum to the local storage.
  storeBlknum(blknum, utxos)

  await Wait.waitChildChainBlknum(address, blknum)
  let newUtxos = await getUtxos(address, {
    currency: utxos[0].currency
  })
  return await mergeUtxosUntilThreshold(
    address,
    privateKey,
    maximumUtxosPerCurrency,
    newUtxos,
    storeBlknum
  )
}

export const createTransactionBody = (
  address,
  utxos,
  payments,
  fee,
  metadata
) => {
  const encodedMetadata =
    (metadata && Transaction.encodeMetadata(metadata)) ||
    PlasmaUtils.transaction.NULL_METADATA

  return PlasmaUtils.transaction.createTransactionBody({
    fromAddress: address,
    fromUtxos: utxos,
    payments,
    fee,
    metadata: encodedMetadata
  })
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

export const createFee = (currency = ContractAddress.ETH_ADDRESS, amount) => ({
  currency,
  amount
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

    const allowance = await Contract.allowanceTokenForTransfer(
      erc20Contract,
      address,
      erc20VaultAddress
    )

    let bnAllowance = new BN(allowance)
    const bnAmount = new BN(weiAmount)
    const bnZero = new BN(0)

    // If the allowance less than the desired amount, we need to reset to zero first inorder to update it.
    // Some erc20 contract prevent to update non-zero allowance e.g. OmiseGO Token.
    if (bnAllowance.gt(bnZero) && bnAllowance.lt(bnAmount)) {
      const approveOptions = TxOptions.createApproveErc20Options(
        address,
        tokenContractAddress,
        erc20Contract,
        erc20VaultAddress,
        '0',
        depositGas,
        depositGasPrice
      )
      approveReceipt = await approveErc20(approveOptions, privateKey)

      // Wait approve transaction for 1 block
      await waitForRootchainTransaction({
        hash: approveReceipt.transactionHash,
        intervalMs: 3000,
        confirmationThreshold: 1
      })
      bnAllowance = new BN(0)
    }

    if (bnAllowance.eq(bnZero)) {
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

      // Wait approve transaction for 1 block
      await waitForRootchainTransaction({
        hash: approveReceipt.transactionHash,
        intervalMs: 3000,
        confirmationThreshold: 1
      })
    }
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
  const { contract, address, bonds } = await getPaymentExitGame()
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

export const getExitTxs = async address => {
  const { contract } = await Plasma.RootChain.getPaymentExitGame()
  const allExitTxs = await contract.getPastEvents('ExitStarted', {
    filter: { owner: address },
    fromBlock: 0
  })
  const pendingFinalizedArr = allExitTxs.map(exitTx => {
    const exitId = exitTx.returnValues.exitId.toString()
    return contract.getPastEvents('ExitFinalized', {
      filter: { exitId },
      fromBlock: 0
    })
  })

  const finalizedArr = await Promise.all(pendingFinalizedArr)
  const filteredUnfinalized = (_, index) => finalizedArr[index].length === 0
  const filteredFinalized = (_, index) => finalizedArr[index].length > 0

  return {
    unprocessed: allExitTxs.filter(filteredUnfinalized),
    processed: allExitTxs.filter(filteredFinalized)
  }
}

const getTxData = (contract, method, ...args) => {
  if (web3.version.api && web3.version.api.startsWith('0.2')) {
    return contract[method].getData(...args)
  } else {
    return contract.methods[method](...args).encodeABI()
  }
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

export const getPaymentExitGame = () => {
  return Plasma.RootChain.getPaymentExitGame()
}

export const getStandardExitBond = async () => {
  if (!standardExitBond) {
    const { bonds } = await getPaymentExitGame()
    standardExitBond = bonds.standardExit.toString()
  }
  return standardExitBond
}

export const isPaymentExitGameContract = async address => {
  const code = await web3.eth.getCode(address)
  const hash = web3.eth.abi.encodeFunctionSignature(
    'startStandardExitBondSize()'
  )
  // Remove 0x prefix
  return code.indexOf(hash.slice(2)) > -1
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

export const getExitTime = (exitRequestBlockNumber, submissionBlockNumber) => {
  return Plasma.RootChain.getExitTime({
    exitRequestBlockNumber,
    submissionBlockNumber
  })
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

export const processExits = (contractAddress, maxExitsToProcess, txOptions) => {
  return Plasma.RootChain.processExits({
    token: contractAddress,
    exitId: 0,
    maxExitsToProcess: parseInt(maxExitsToProcess, 10),
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
