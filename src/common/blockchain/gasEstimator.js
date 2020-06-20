import { Gas } from 'common/constants'
import {
  Ethereum,
  TxDetails,
  Plasma,
  ContractABI,
  Transaction,
  Contract
} from 'common/blockchain'
import { web3, Plasma as PlasmaClient } from 'common/clients'
import { Unit } from 'common/utils'

export const estimateTransferErc20 = (from, to, token) => {
  const abi = ContractABI.erc20Abi()
  const contract = Ethereum.getContract(token.contractAddress, abi)
  const amount = Unit.convertToString(token.balance, 0, token.tokenDecimal)
  const txDetails = {
    from,
    to,
    data: contract.methods.transfer(to, amount).encodeABI()
  }

  return web3EstimateGas(txDetails)
}

export const estimateTransferETH = () => {
  return Promise.resolve(Gas.MINIMUM_GAS_USED)
}

export const estimateApproveErc20 = async (from, token) => {
  const weiAmount = Unit.convertToString(token.balance, 0, token.tokenDecimal)
  if (!Plasma.isRequireApproveErc20(from, weiAmount, token.contractAddress)) {
    return 0
  }

  const approveErc20Tx = TxDetails.getApproveErc20(
    from,
    token.contractAddress,
    weiAmount,
    Gas.MEDIUM_LIMIT,
    Gas.DEPOSIT_GAS_PRICE
  )
  const estimatedErc20ApprovalGas = await web3EstimateGas(approveErc20Tx)

  const allowance = await Contract.getErc20Allowance(
    from,
    token.contractAddress
  )

  return allowance !== '0'
    ? estimatedErc20ApprovalGas * 2
    : estimatedErc20ApprovalGas
}

export const estimateDeposit = async (from, amount, tokenContractAddress) => {
  try {
    const depositTxOptions = await TxDetails.getDeposit(
      tokenContractAddress,
      from,
      amount,
      Gas.MEDIUM_LIMIT,
      Gas.DEPOSIT_GAS_PRICE
    )

    // Increase the gas estimation a bit to avoid transaction reverted because the gas limit is too low.
    return web3EstimateGas(depositTxOptions).then(gas => parseInt(gas * 1.1))
  } catch (err) {
    console.log(err)
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
  return Promise.resolve(0)
}
