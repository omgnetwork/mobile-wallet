import { GasEstimator } from 'common/blockchain'
import { BlockchainNetworkType, ContractAddress } from 'common/constants'
import Config from 'react-native-config'

export const TYPE_DEPOSIT = 1
export const TYPE_TRANSFER_ROOTCHAIN = 2
export const TYPE_TRANSFER_CHILDCHAIN = 3
export const TYPE_EXIT = 4

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

export const getGasUsed = (type, token, options) => {
  const { wallet, to, includeExitBond } = options
  switch (type) {
    case TYPE_DEPOSIT:
      return GasEstimator.estimateDeposit(wallet.address, to, token)
    case TYPE_TRANSFER_ROOTCHAIN: {
      const isEth = token.contractAddress === ContractAddress.ETH_ADDRESS
      return isEth
        ? GasEstimator.estimateTransferETH()
        : GasEstimator.estimateTransferErc20(wallet.address, to, token)
    }
    case TYPE_TRANSFER_CHILDCHAIN:
      return GasEstimator.estimateTransferChildchain()
    case TYPE_EXIT:
      return GasEstimator.estimateExit(wallet, token, includeExitBond)
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
