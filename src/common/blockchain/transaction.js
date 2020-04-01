import { TransactionActionTypes, ContractAddress, Gas } from 'common/constants'
import { OmgUtil, ContractABI } from 'common/blockchain'
import { Plasma as PlasmaClient } from 'common/clients'
import InputDataDecoder from 'ethereum-input-data-decoder'

const plasmaInputDecoder = new InputDataDecoder(ContractABI.plasmaAbi())

export const encodeMetadata = metadata => {
  return OmgUtil.transaction.encodeMetadata(metadata)
}

export const decodeMetadata = encodedMetadata => {
  return OmgUtil.transaction.decodeMetadata(encodedMetadata)
}

export const getTypedData = tx => {
  return OmgUtil.transaction.getTypedData(
    tx,
    PlasmaClient.RootChain.plasmaContractAddress
  )
}

export const decodePlasmaInputMethod = input => {
  return plasmaInputDecoder.decodeData(input).method
}

export const isReceiveTx = (walletAddress, toAddress) => {
  if (!toAddress) return false
  return walletAddress.toLowerCase() === toAddress.toLowerCase()
}

export const isPlasmaCallTx = (tx, standardExitBondSize) => {
  const { to, value, gasUsed } = tx
  const {
    PLASMA_FRAMEWORK_CONTRACT_ADDRESS,
    PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
  } = ContractAddress
  const isCurrentPlasmaContract = [
    PLASMA_FRAMEWORK_CONTRACT_ADDRESS,
    PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
  ].includes(to)
  const isOldPaymentExitGameContract =
    value === standardExitBondSize && gasUsed > Gas.MINIMUM_GAS_USED

  return isCurrentPlasmaContract || isOldPaymentExitGameContract
}

export const isExitTransferTx = tx => {
  const {
    ETH_VAULT_CONTRACT_ADDRESS,
    ERC20_VAULT_CONTRACT_ADDRESS,
    PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
  } = ContractAddress
  const vaultsContractAddress = [
    ETH_VAULT_CONTRACT_ADDRESS,
    ERC20_VAULT_CONTRACT_ADDRESS,
    PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
  ]
  return vaultsContractAddress.includes(tx.from)
}

export const isUnconfirmStartedExitTx = tx => {
  return (
    tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT && !tx.status
  )
}

export const isConfirmedStartedExitTx = tx => {
  return (
    tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT &&
    tx.status === 'started'
  )
}

export const isReadyToProcessExitTx = tx => {
  return (
    tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT &&
    tx.status === 'ready'
  )
}
