import { transaction } from '@omisego/omg-js-util'
import { ContractABI } from 'common/utils'
import { TransactionActionTypes, ContractAddress, Gas } from 'common/constants'
import InputDataDecoder from 'ethereum-input-data-decoder'
import { Plasma } from 'common/blockchain'

const plasmaInputDecoder = new InputDataDecoder(ContractABI.plasmaAbi())

export const encodeMetadata = metadata => {
  return transaction.encodeMetadata(metadata)
}

export const decodeMetadata = encodedMetadata => {
  return transaction.decodeMetadata(encodedMetadata)
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
