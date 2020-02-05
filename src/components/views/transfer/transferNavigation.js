import * as TransferHelper from './transferHelper'
import feeOptions from './feeOptions'

export const paramsForTransferFormToTransferSelectBalance = ({
  transferType,
  selectedToken,
  currentAmount
}) => {
  return {
    currentToken: selectedToken,
    lastAmount: currentAmount,
    transferType
  }
}

export const paramsForTransferFormToTransferConfirm = ({
  selectedToken,
  currentAmount,
  currentAddress,
  wallet,
  transferType,
  selectedFee
}) => {
  return {
    token: { ...selectedToken, balance: currentAmount },
    fromWallet: wallet,
    transferType,
    toWallet: {
      name:
        transferType === TransferHelper.TYPE_DEPOSIT
          ? 'Plasma Contract'
          : 'Another wallet',
      address: currentAddress
    },
    fee: TransferHelper.getTransferFee(transferType, selectedFee)
  }
}

export const paramsForTransferFormToTransferScanner = ({ isRootchain }) => {
  return {
    rootchain: isRootchain
  }
}

export const paramsForTransferFormToTransferSelectFee = ({
  selectedToken,
  currentAmount,
  selectedFee
}) => {
  return {
    currentToken: {
      ...selectedToken,
      balance: currentAmount
    },
    currentFee: selectedFee,
    fee: feeOptions
  }
}

export const paramsForTransferConfirmToTransferForm = ({ token }) => {
  return {
    lastAmount: token.balance
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
    currentToken: assets[0],
    assets,
    lastAmount: null
  }
}

export const paramsForTransferConfirmToTransferPending = ({
  token,
  fromWallet,
  toWallet,
  transferType,
  estimatedFee,
  estimatedFeeUsd,
  lastUnconfirmedTx,
  fee
}) => {
  return {
    token,
    fromWallet,
    toWallet,
    transferType,
    estimatedFee,
    estimatedFeeUsd,
    unconfirmedTx: lastUnconfirmedTx,
    fee
  }
}

export const paramsForTransferSelectBalanceToAnywhere = ({
  selectedToken,
  currentToken,
  address,
  transferType
}) => {
  return {
    selectedToken: selectedToken || currentToken,
    shouldFocus: true,
    lastAmount: null,
    transferType,
    address
  }
}

export const getParamsForTransferConfirmFromTransferForm = navigation => {
  return {
    token: navigation.getParam('token'),
    fromWallet: navigation.getParam('fromWallet'),
    toWallet: navigation.getParam('toWallet'),
    fee: navigation.getParam('fee'),
    transferType: navigation.getParam('transferType')
  }
}

export const getParamsForTransferScannerFromTransferForm = navigation => {
  return {
    rootchain: navigation.getParam('rootchain')
  }
}

export const getParamsForTransferSelectFeeFromTransferForm = navigation => {
  return {
    fees: feeOptions,
    currentToken: navigation.getParam('currentToken'),
    currentFee: navigation.getParam('currentFee')
  }
}

export const getParamsForTransferSelectTokenFeeFromTransferForm = navigation => {
  return {
    currentFeeToken: navigation.getParam('currentFeeToken'),
    tokens: navigation.getParam('tokens')
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
    currentToken: navigation.getParam('currentToken'),
    lastAmount: navigation.getParam('lastAmount'),
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
