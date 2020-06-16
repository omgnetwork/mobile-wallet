import { Plasma, web3 } from 'common/clients'
import { Gas, ContractAddress } from 'common/constants'
import { Mapper } from 'common/utils'
import BN from 'bn.js'
import {
  TxOptions,
  Contract,
  ContractABI,
  Transaction,
  OmgUtil,
  Parser,
  Wait,
  Utxos
} from 'common/blockchain'

export const getBalances = address => {
  return Plasma.ChildChain.getBalance(address).then(balances => {
    return balances.map(Mapper.mapChildchainAmount)
  })
}

export const transfer = async (
  fromBlockchainWallet,
  toAddress,
  token,
  fee,
  metadata
) => {
  const payment = Transaction.createPayment(
    toAddress,
    token.contractAddress,
    Parser.parseUnits(token.balance, token.tokenDecimal).toString(16)
  )
  const childchainFee = Transaction.createFee(fee.contractAddress, fee.amount)
  const { address } = fromBlockchainWallet
  const utxos = await Utxos.get(address, {
    sort: (a, b) => new BN(b.amount).sub(new BN(a.amount))
  })
  const txBody = Transaction.createBody(
    address,
    utxos,
    [payment],
    childchainFee,
    metadata
  )

  const typedData = Transaction.getTypedData(txBody)
  const privateKeys = new Array(txBody.inputs.length).fill(
    fromBlockchainWallet.privateKey
  )
  const signatures = Transaction.sign(typedData, privateKeys)
  const signedTxn = Transaction.buildSigned(typedData, signatures)
  return Transaction.submit(signedTxn)
}

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
      await Wait.waitForRootchainTransaction({
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
      await Wait.waitForRootchainTransaction({
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

export const mergeListOfUtxos = async (
  address,
  privateKey,
  maximumUtxosPerCurrency = 4,
  listOfUtxos,
  storeBlknum = () => {}
) => {
  const pendingMergeUtxos = listOfUtxos.map(utxos =>
    Utxos.mergeUntilThreshold(
      address,
      privateKey,
      maximumUtxosPerCurrency,
      utxos,
      storeBlknum
    )
  )
  return Promise.all(pendingMergeUtxos)
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

export const getStandardExitBond = async () => {
  try {
    const { bonds } = await Contract.getPaymentExitGame()
    return bonds.standardExit.toString()
  } catch (e) {
    return '14000000000000000'
  }
}

export const getErrorReason = async hash => {
  try {
    return await OmgUtil.ethErrorReason({ web3, hash })
  } catch (e) {
    console.log(e)
    return 'Cannot retrieve error reason'
  }
}

export const getStandardExitId = (utxoToExit, exitData) => {
  return Plasma.RootChain.getStandardExitId({
    txBytes: exitData.txbytes,
    utxoPos: exitData.utxo_pos,
    isDeposit: utxoToExit.blknum % 1000 !== 0
  })
}

export const getExitTime = (exitRequestBlockNumber, submissionBlockNumber) => {
  return Plasma.RootChain.getExitTime({
    exitRequestBlockNumber,
    submissionBlockNumber
  })
}

export const processExits = (contractAddress, maxExitsToProcess, txOptions) => {
  return Plasma.RootChain.processExits({
    token: contractAddress,
    exitId: 0,
    maxExitsToProcess: parseInt(maxExitsToProcess, 10),
    txOptions
  })
}

export const getExitData = utxo => {
  const { amount, blknum, currency, oindex, owner, txindex, utxo_pos } = utxo
  const params = {
    amount,
    blknum,
    currency,
    oindex,
    owner,
    txindex,
    utxo_pos
  }
  return Plasma.ChildChain.getExitData(params)
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

export const getFees = () => {
  return Plasma.ChildChain.getFees().then(response => {
    return response['1']
  })
}
