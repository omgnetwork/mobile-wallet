import { TransactionActionTypes, ContractAddress, Gas } from 'common/constants'
import { OmgUtil, ContractABI, Contract } from 'common/blockchain'
import { Plasma as PlasmaClient } from 'common/clients'
import InputDataDecoder from 'ethereum-input-data-decoder'
import BN from 'bn.js'

const plasmaInputDecoder = new InputDataDecoder(ContractABI.plasmaAbi())

export const encodeMetadata = metadata => {
  return OmgUtil.transaction.encodeMetadata(metadata)
}

export const decodeMetadata = encodedMetadata => {
  return OmgUtil.transaction.decodeMetadata(encodedMetadata)
}

export const createPayment = (address, tokenContractAddress, amount) => {
  return {
    owner: address,
    currency: tokenContractAddress,
    amount: new BN(amount)
  }
}

export const createFee = (
  currency = ContractAddress.ETH_ADDRESS,
  amount = 0
) => ({
  currency,
  amount: new BN(amount)
})

export const createBody = (address, utxos, payments, fee, metadata) => {
  const encodedMetadata =
    (metadata && encodeMetadata(metadata)) || OmgUtil.transaction.NULL_METADATA

  return OmgUtil.transaction.createTransactionBody({
    fromAddress: address,
    fromUtxos: utxos,
    payments,
    fee,
    metadata: encodedMetadata
  })
}

export const getTypedData = tx => {
  return OmgUtil.transaction.getTypedData(
    tx,
    Contract.getPlasmaContractAddress()
  )
}

export const sign = (typedData, privateKeys) => {
  return PlasmaClient.ChildChain.signTransaction(typedData, privateKeys)
}

export const buildSigned = (typedData, signatures) => {
  return PlasmaClient.ChildChain.buildSignedTransaction(typedData, signatures)
}

export const submit = signedTx => {
  return PlasmaClient.ChildChain.submitTransaction(signedTx)
}

const getData = (web3, contract, method, ...args) => {
  if (web3.version.api && web3.version.api.startsWith('0.2')) {
    return contract[method].getData(...args)
  } else {
    return contract.methods[method](...args).encodeABI()
  }
}

export const getExitDetails = async (web3, tx, { from, gas, gasPrice }) => {
  const { utxo_pos, txbytes, proof } = tx
  const { contract, address, bonds } = await Contract.getPaymentExitGame()
  const data = getData(web3, contract, 'startStandardExit', [
    utxo_pos.toString(),
    txbytes,
    proof
  ])
  const value = bonds.standardExit
  return {
    from,
    to: address,
    value,
    data,
    gas,
    gasPrice
  }
}

export const decodePlasmaInputMethod = input => {
  return plasmaInputDecoder.decodeData(input).method
}

export const isReceive = (walletAddress, toAddress) => {
  if (!toAddress) return false
  return walletAddress.toLowerCase() === toAddress.toLowerCase()
}

export const isPlasmaContractCall = (tx, standardExitBondSize) => {
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

export const isProcessedExit = tx => {
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

export const isUnconfirmStartedExit = tx => {
  return (
    tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT && !tx.status
  )
}

export const isConfirmedStartedExit = tx => {
  return (
    tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT &&
    tx.status === 'started'
  )
}

export const isReadyToProcessExit = tx => {
  return (
    tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_EXIT &&
    tx.status === 'ready'
  )
}
