import { Gas } from 'common/constants'
import {
  TxDetails,
  Plasma,
  Transaction,
  Contract,
  Ethereum
} from 'common/blockchain'
import { web3 } from 'common/clients'

export const estimateTransferErc20 = sendTransactionParams => {
  const txDetails = TxDetails.getTransferErc20(sendTransactionParams)
  return web3EstimateGas(txDetails)
}

export const estimateTransferETH = () => {
  return Promise.resolve(Gas.MINIMUM_GAS_USED)
}

export const estimateApproveErc20 = async sendTransactionParams => {
  const isRequiredApproval = await Ethereum.isRequireApproveErc20(
    sendTransactionParams
  )

  if (!isRequiredApproval) {
    return 0
  }

  const approveErc20Tx = await TxDetails.getApproveErc20(sendTransactionParams)
  const allowance = await Contract.getErc20Allowance(sendTransactionParams)
  const estimatedErc20ApprovalGas = await web3EstimateGas(approveErc20Tx)

  return allowance !== '0'
    ? estimatedErc20ApprovalGas * 2
    : estimatedErc20ApprovalGas
}

export const estimateDeposit = async sendTransactionParams => {
  try {
    const depositTxOptions = await TxDetails.getDeposit(sendTransactionParams)

    // Increase the gas estimation a bit to avoid transaction reverted because the gas limit is too low.
    return web3EstimateGas(depositTxOptions).then(gas => parseInt(gas * 1.1))
  } catch (err) {
    console.error(err)
    return Gas.DEPOSIT_ESTIMATED_GAS_USED
  }
}

export const estimateExit = async (
  blockchainWallet,
  utxos,
  includeExitBond = false
) => {
  const sampleUtxoToExit = utxos[0]
  const exitTx = await Plasma.getExitData(sampleUtxoToExit)
  const from = blockchainWallet.address
  const gas = Gas.EXIT_ESTIMATED_GAS_USED
  const gasPrice = Gas.EXIT_GAS_PRICE
  const txDetails = await Transaction.getExitDetails(exitTx, {
    from,
    gas,
    gasPrice
  })
  const bondFee = txDetails.value / gasPrice
  try {
    const exitGas = await web3EstimateGas(txDetails)
    if (includeExitBond) {
      return exitGas + bondFee
    } else {
      return exitGas
    }
  } catch (err) {
    return Gas.EXIT_ESTIMATED_GAS_USED
  }
}

export const web3EstimateGas = txDetails => {
  return new Promise((resolve, reject) => {
    web3.eth.estimateGas(txDetails, (err, result) => {
      if (err) return reject(err)
      return resolve(parseInt(result))
    })
  })
}

export const estimateTransferChildchain = () => {
  return Promise.resolve(1)
}
