import * as TransferHelper from './transferHelper'
import feeOptions from './feeOptions'

export const paramsForTransferFormToTransferSelectBalance = ({
  transferType,
  selectedToken,
  currentAmount,
  isRootchain,
  wallet
}) => {
  return {
    currentToken: selectedToken,
    lastAmount: currentAmount,
    rootchain: isRootchain,
    assets: TransferHelper.getAssets(
      transferType,
      wallet.rootchainAssets,
      wallet.childchainAssets
    )
  }
}

export const paramsForTransferFormToTransferConfirm = ({
  selectedToken,
  currentAmount,
  currentAddress,
  wallet,
  isRootchain,
  isDeposit,
  transferType,
  depositFee,
  selectedFee
}) => {
  return {
    token: { ...selectedToken, balance: currentAmount },
    fromWallet: wallet,
    isRootchain: isRootchain,
    isDeposit: isDeposit,
    toWallet: {
      name: isDeposit ? 'Plasma Contract' : 'Another wallet',
      address: currentAddress
    },
    fee: TransferHelper.getNavigationFee(transferType, depositFee, selectedFee)
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
    rootchain: isRootchain,
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
    lastUnconfirmedTx,
    fee
  }
}

export const paramsForTransferSelectBalanceToAnywhere = ({
  selectedToken,
  currentToken,
  address
}) => {
  return {
    selectedToken: selectedToken || currentToken,
    shouldFocus: true,
    lastAmount: null,
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
    fees: navigation.getParams('fee'),
    currentToken: navigation.getParams('currentToken'),
    currentFee: navigation.getParams('currentFee')
  }
}

export const getParamsForTransferSelectBalanceFromTransferForm = (
  navigation,
  rootchainAssets
) => {
  return {
    address: navigation.getParam('address'),
    assets: navigation.getParam('assets', rootchainAssets),
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
