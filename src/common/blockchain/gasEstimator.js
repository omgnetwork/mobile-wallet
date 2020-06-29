import { Gas } from 'common/constants'
import { TxDetails, Contract, Ethereum } from 'common/blockchain'
import { web3 } from 'common/clients'

const OVER_ESTIMATED_RATIO = 1.1

export const estimateTransferChildchain = () => 1

export const estimateTransferETH = () => Gas.MINIMUM_GAS_USED

export const estimateTransferErc20 = sendTransactionParams => {
  return TxDetails.getTransferErc20(sendTransactionParams).then(estimateGas)
}

export const estimateDeposit = sendTransactionParams => {
  return TxDetails.getDeposit(sendTransactionParams)
    .then(estimateGas)
    .then(overEstimated)
}

export const estimateExit = sendTransactionParams => {
  return TxDetails.getExit(sendTransactionParams)
    .then(estimateGas)
    .then(overEstimated)
}

export const estimateCreateExitQueue = async sendTransactionParams => {
  return TxDetails.getCreateExitQueue(sendTransactionParams).then(estimateGas)
}

export const estimateApproveErc20 = async sendTransactionParams => {
  const isRequiredApproval = await Ethereum.isRequireApproveErc20(
    sendTransactionParams
  )

  if (!isRequiredApproval) {
    return 0
  }

  const allowance = await Contract.getErc20Allowance(sendTransactionParams)
  const txDetails = await TxDetails.getApproveErc20(sendTransactionParams)
  const estimatedErc20ApprovalGas = await estimateGas(txDetails)

  return allowance !== '0'
    ? estimatedErc20ApprovalGas * 2
    : estimatedErc20ApprovalGas
}

export const estimateGas = txDetails => {
  return new Promise((resolve, reject) => {
    web3.eth.estimateGas(txDetails, (err, result) => {
      if (err) return reject(err)
      return resolve(parseInt(result))
    })
  })
}

const overEstimated = gas => parseInt(gas * OVER_ESTIMATED_RATIO)
