import * as TransferHelper from './transferHelper'
import feeOptions from './feeOptions'

export const getParamsForTransferForm = (navigation, wallet) => {
  const transferType = navigation.getParam('transferType')
  return {
    selectedEthFee: navigation.getParam('selectedEthFee'),
    selectedPlasmaFee: navigation.getParam('selectedPlasmaFee'),
    selectedToken: navigation.getParam(
      'selectedToken',
      TransferHelper.getDefaultToken(
        transferType,
        wallet.rootchainAssets,
        wallet.childchainAssets
      )
    ),
    amount: navigation.getParam('amount'),
    address: navigation.getParam('address'),
    transferType
  }
}

export const paramsForTransferFormToTransferSelectBalance = ({
  transferType,
  selectedToken,
  amount
}) => {
  return {
    selectedToken,
    amount,
    transferType
  }
}

export const paramsForTransferFormToTransferConfirm = ({
  selectedToken,
  amount,
  address,
  selectedPlasmaFee,
  wallet,
  transferType,
  selectedEthFee
}) => {
  return {
    token: { ...selectedToken, balance: amount },
    fromWallet: wallet,
    transferType,
    selectedPlasmaFee,
    toWallet: {
      name:
        transferType === TransferHelper.TYPE_DEPOSIT
          ? 'OMG Network'
          : 'Another wallet',
      address: address
    },
    selectedEthFee: TransferHelper.getTransferFee(transferType, selectedEthFee)
  }
}

export const paramsForTransferFormToTransferScanner = ({ isRootchain }) => {
  return {
    rootchain: isRootchain
  }
}

export const paramsForTransferFormToTransferSelectFee = ({
  selectedToken,
  selectedEthFee,
  gasOptions,
  amount,
  fromScreen = 'TransferForm'
}) => {
  return {
    selectedToken: {
      ...selectedToken,
      balance: amount
    },
    selectedEthFee,
    fees: gasOptions,
    fromScreen
  }
}

export const paramsForTransferSelectPlasmaFeeToTransferForm = ({
  selectedPlasmaFee
}) => {
  return {
    selectedPlasmaFee
  }
}

export const paramsForTransferFormToTransferSelectPlasmaFee = ({
  selectedPlasmaFee,
  fees
}) => {
  return {
    selectedPlasmaFee: selectedPlasmaFee || fees[0]
  }
}

export const paramsForTransferSelectEthFeeToTransferForm = ({
  selectedEthFee,
  amount
}) => {
  return {
    selectedEthFee,
    amount
  }
}

export const paramsForTransferConfirmToTransferForm = ({ token }) => {
  return {
    amount: token.balance
  }
}

export const paramsForTransferScannerToTransferSelectBalance = ({
  address,
  isRootchain,
  assets
}) => {
  return {
    address: address && address.replace('ethereum:', ''),
    transferType: isRootchain
      ? TransferHelper.TYPE_TRANSFER_ROOTCHAIN
      : TransferHelper.TYPE_TRANSFER_CHILDCHAIN,
    selectedToken: assets[0],
    assets,
    amount: null
  }
}

export const paramsForTransferConfirmToTransferPending = ({
  token,
  fromWallet,
  toWallet,
  transferType,
  estimatedFee,
  estimatedFeeUsd,
  lastUnconfirmedTx
}) => {
  return {
    token,
    fromWallet,
    toWallet,
    transferType,
    estimatedFee,
    estimatedFeeUsd,
    unconfirmedTx: lastUnconfirmedTx
  }
}

export const paramsForTransferSelectBalanceToAnywhere = ({
  selectedToken,
  address,
  transferType
}) => {
  return {
    selectedToken,
    amount: null,
    transferType,
    address
  }
}

export const getParamsForTransferConfirmFromTransferForm = navigation => {
  return {
    token: navigation.getParam('token'),
    fromWallet: navigation.getParam('fromWallet'),
    toWallet: navigation.getParam('toWallet'),
    transferType: navigation.getParam('transferType'),
    selectedEthFee: navigation.getParam('selectedEthFee'),
    selectedPlasmaFee: navigation.getParam('selectedPlasmaFee')
  }
}

export const getParamsForTransferScannerFromTransferForm = navigation => {
  return {
    rootchain: navigation.getParam('rootchain')
  }
}

export const getParamsForTransferSelectFeeFromTransferForm = navigation => {
  return {
    fees: navigation.getParam('fees'),
    selectedToken: navigation.getParam('selectedToken'),
    selectedEthFee: navigation.getParam('selectedEthFee'),
    fromScreen: navigation.getParam('fromScreen')
  }
}

export const getParamsForTransferSelectPlasmaFeeFromTransferForm = navigation => {
  return {
    selectedPlasmaFee: navigation.getParam('selectedPlasmaFee')
  }
}

export const getParamsForTransferSelectBalanceFromTransferForm = (
  navigation,
  { rootchainAssets, childchainAssets }
) => {
  const transferType = navigation.getParam('transferType')
  const assets = TransferHelper.getAssets(
    transferType,
    rootchainAssets,
    childchainAssets
  )
  return {
    address: navigation.getParam('address'),
    assets: assets,
    selectedToken: navigation.getParam('selectedToken'),
    amount: navigation.getParam('amount'),
    transferType: navigation.getParam('transferType')
  }
}

export const getParamsForTransferPendingFromTransferConfirm = navigation => {
  return {
    unconfirmedTx: navigation.getParam('unconfirmedTx'),
    token: navigation.getParam('token'),
    fromWallet: navigation.getParam('fromWallet'),
    toWallet: navigation.getParam('toWallet'),
    transferType: navigation.getParam('transferType'),
    estimatedGasFee: navigation.getParam('estimatedFee'),
    estimatedGasFeeUsd: navigation.getParam('estimatedFeeUsd')
  }
}
