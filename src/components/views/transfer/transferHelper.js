import { GasEstimator } from 'common/blockchain'
import { BlockchainNetworkType, ContractAddress } from 'common/constants'
import Config from 'react-native-config'

export const TYPE_DEPOSIT = 1
export const TYPE_TRANSFER_ROOTCHAIN = 2
export const TYPE_TRANSFER_CHILDCHAIN = 3
export const TYPE_EXIT = 4
export const TYPE_APPROVE_ERC20 = 5

export const getType = (address, primaryWalletNetwork) => {
  if (address === Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS) {
    return TYPE_DEPOSIT
  } else if (
    primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
  ) {
    return TYPE_TRANSFER_ROOTCHAIN
  } else {
    return TYPE_TRANSFER_CHILDCHAIN
  }
}

export const getGasUsed = (type, sendTransactionParams) => {
  switch (type) {
    case TYPE_APPROVE_ERC20:
      return GasEstimator.estimateApproveErc20(sendTransactionParams)
    case TYPE_DEPOSIT:
      return GasEstimator.estimateDeposit(sendTransactionParams)
    case TYPE_TRANSFER_ROOTCHAIN: {
      const { token } = sendTransactionParams.smallestUnitAmount
      const isEth = token.contractAddress === ContractAddress.ETH_ADDRESS
      return isEth
        ? GasEstimator.estimateTransferETH()
        : GasEstimator.estimateTransferErc20(sendTransactionParams)
    }
    case TYPE_TRANSFER_CHILDCHAIN:
      return GasEstimator.estimateTransferChildchain()
    case TYPE_EXIT:
      return GasEstimator.estimateExit(wallet, token, true)
  }
}

export const getAssets = (type, wallet) => {
  switch (type) {
    case TYPE_TRANSFER_CHILDCHAIN:
      return wallet.childchainAssets
    default:
      return wallet.rootchainAssets
  }
}
