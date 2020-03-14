import { GasEstimator } from 'common/utils'
import { ContractAddress, Gas } from 'common/constants'

export const TYPE_DEPOSIT = 1
export const TYPE_TRANSFER_ROOTCHAIN = 2
export const TYPE_TRANSFER_CHILDCHAIN = 3
export const TYPE_EXIT = 4

export const getTypes = (isRootchain, isDeposit) => {
  if (isDeposit) {
    return TYPE_DEPOSIT
  } else if (isRootchain) {
    return TYPE_TRANSFER_ROOTCHAIN
  } else {
    return TYPE_TRANSFER_CHILDCHAIN
  }
}

export const getGasUsed = (type, token, options) => {
  const { wallet, to, fee, includeExitBond } = options
  switch (type) {
    case TYPE_DEPOSIT:
      return GasEstimator.estimateDeposit(wallet.address, to, token)
    case TYPE_TRANSFER_ROOTCHAIN:
      const isEth = token.contractAddress === ContractAddress.ETH_ADDRESS
      return isEth
        ? GasEstimator.estimateTransferETH()
        : GasEstimator.estimateTransferErc20(wallet, to, fee, token)
    case TYPE_TRANSFER_CHILDCHAIN:
      return GasEstimator.estimateTransferChildchain()
    case TYPE_EXIT:
      return GasEstimator.estimateExit(wallet, token, includeExitBond)
  }
}

export const getTransferFee = (type, selectedTransferFee) => {
  const depositFee = { amount: Gas.DEPOSIT_GAS_PRICE }
  const childchainTrasferFee = { amount: 0 }
  switch (type) {
    case TYPE_DEPOSIT:
      return depositFee
    case TYPE_TRANSFER_ROOTCHAIN:
      return selectedTransferFee
    case TYPE_TRANSFER_CHILDCHAIN:
      return childchainTrasferFee
    default:
      return null
  }
}

export const getAssets = (type, rootchainAssets, childchainAssets) => {
  switch (type) {
    case TYPE_EXIT:
    case TYPE_TRANSFER_CHILDCHAIN:
      return childchainAssets
    default:
      return rootchainAssets
  }
}

export const getDefaultToken = (type, rootchainAssets, childchainAssets) => {
  switch (type) {
    case TYPE_EXIT:
    case TYPE_TRANSFER_CHILDCHAIN:
      return childchainAssets[0]
    default:
      return rootchainAssets[0]
  }
}
