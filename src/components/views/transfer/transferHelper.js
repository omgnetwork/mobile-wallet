import { GasEstimator } from 'common/utils'
import { ContractAddress } from 'common/constants'

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
  switch (type) {
    case TYPE_DEPOSIT:
      return GasEstimator.estimateDeposit(token)
    case TYPE_TRANSFER_ROOTCHAIN:
      const { wallet, to, fee } = options
      const isEth = token.contractAddress === ContractAddress.ETH_ADDRESS
      return isEth
        ? GasEstimator.estimateTransferETH()
        : GasEstimator.estimateTransferErc20(wallet, to, fee, token)
    case TYPE_TRANSFER_CHILDCHAIN:
      return GasEstimator.estimateTransferChildchain()
  }
}

export const getNavigationFee = (type, depositFee, selectedTransferFee) => {
  switch (type) {
    case TYPE_DEPOSIT:
      return depositFee
    case TYPE_TRANSFER_ROOTCHAIN:
      return selectedTransferFee
    default:
      return null
  }
}

export const getAssets = (type, rootchainAssets, childchainAssets) => {
  switch (type) {
    case TYPE_TRANSFER_CHILDCHAIN:
      return childchainAssets
    default:
      return rootchainAssets
  }
}

export const getDefaultToken = (type, rootchainAssets, childchainAssets) => {
  switch (type) {
    case TYPE_TRANSFER_CHILDCHAIN:
      return childchainAssets[0]
    default:
      return rootchainAssets[0]
  }
}
