import { Gas, ContractAddress } from 'common/constants'
import {
  Ethereum,
  TxOptions,
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
  return Promise.resolve('21000')
}

export const estimateApproveErc20 = async (from, token) => {
  const erc20Contract = new web3.eth.Contract(
    ContractABI.erc20Abi(),
    token.contractAddress
  )
  const {
    address: erc20VaultAddress
  } = await PlasmaClient.RootChain.getErc20Vault()
  const approveErc20Tx = TxOptions.createApproveErc20Options(
    from,
    token.contractAddress,
    erc20Contract,
    erc20VaultAddress,
    1,
    Gas.MEDIUM_LIMIT,
    Gas.DEPOSIT_GAS_PRICE
  )
  const estimatedErc20ApprovalGas = await web3EstimateGas(approveErc20Tx)
  const allowance = await Contract.getErc20Allowance(
    erc20Contract,
    from,
    erc20VaultAddress
  )
  return allowance !== 0 ? estimatedErc20ApprovalGas * 2 : estimateApproveErc20
}

export const estimateDeposit = async (from, to, token) => {
  const isEth = token.contractAddress === ContractAddress.ETH_ADDRESS
  const gasForDepositTx = Gas.DEPOSIT_ESTIMATED_GAS_USED
  const gasForApproveErc20 = Gas.DEPOSIT_APPROVED_ERC20_GAS_USED
  const defaultGasUsed = gasForDepositTx + (isEth ? 0 : gasForApproveErc20)

  try {
    const erc20Contract = new web3.eth.Contract(
      ContractABI.erc20Abi(),
      token.contractAddress
    )
    const {
      address: erc20VaultAddress
    } = await PlasmaClient.RootChain.getErc20Vault()
    const weiAmount = Unit.convertToString(token.balance, 0, token.tokenDecimal)
    const approveErc20Tx = TxOptions.createApproveErc20Options(
      from,
      token.contractAddress,
      erc20Contract,
      erc20VaultAddress,
      weiAmount,
      Gas.MEDIUM_LIMIT,
      Gas.DEPOSIT_GAS_PRICE
    )
    const estimatedErc20ApprovalGas = await web3EstimateGas(approveErc20Tx)
    return isEth
      ? gasForDepositTx
      : Number(estimatedErc20ApprovalGas) + Number(gasForDepositTx)
  } catch (err) {
    console.log(err)
    return defaultGasUsed
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
      return resolve(result)
    })
  })
}

export const estimateTransferChildchain = () => {
  return Promise.resolve(0)
}
