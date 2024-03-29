import { ContractAddress } from 'common/constants'
import { Plasma, web3 } from 'common/clients'
import { ContractABI, Ethereum, Contract } from 'common/blockchain'
import { Gas } from 'common/constants'

export const getTransferEth = async ({
  addresses,
  smallestUnitAmount,
  gasOptions
}) => {
  const { from, to } = addresses
  const { amount } = smallestUnitAmount
  const { gas, gasPrice } = gasOptions

  return {
    from,
    to,
    value: amount,
    gas: gas || Gas.MINIMUM_GAS_USED,
    gasPrice
  }
}

export const getTransferErc20 = async ({
  addresses,
  smallestUnitAmount,
  gasOptions
}) => {
  const { from, to } = addresses
  const { amount, token } = smallestUnitAmount
  const { gas, gasPrice } = gasOptions

  const abi = ContractABI.erc20Abi()
  const contract = Ethereum.getContract(token.contractAddress, abi)

  return {
    from,
    to: contract._address,
    data: contract.methods.transfer(to, amount).encodeABI(),
    gas: gas || Gas.LOW_LIMIT,
    gasPrice
  }
}

export const getDeposit = async ({
  smallestUnitAmount,
  addresses,
  gasOptions
}) => {
  const { token, amount } = smallestUnitAmount
  const { from } = addresses
  const { gas, gasPrice } = gasOptions

  const isEth = token.contractAddress === ContractAddress.ETH_ADDRESS

  const { address, contract } = isEth
    ? await Plasma.RootChain.getEthVault()
    : await Plasma.RootChain.getErc20Vault()

  const depositTx = Plasma.Utils.transaction.encodeDeposit(
    from,
    amount,
    token.contractAddress
  )

  return {
    from,
    to: address,
    ...(isEth ? { value: amount } : {}),
    data: contract.methods.deposit(depositTx).encodeABI(),
    gas: gas || Gas.DEPOSIT_ESTIMATED_GAS_USED,
    gasPrice
  }
}

export const getApproveErc20 = async ({
  smallestUnitAmount,
  addresses,
  gasOptions
}) => {
  const { token, amount } = smallestUnitAmount
  const { from } = addresses
  const { gas, gasPrice } = gasOptions

  const erc20Contract = new web3.eth.Contract(
    ContractABI.erc20Abi(),
    token.contractAddress
  )
  const { address: erc20VaultAddress } = await Plasma.RootChain.getErc20Vault()

  return {
    from,
    to: token.contractAddress,
    data: erc20Contract.methods.approve(erc20VaultAddress, amount).encodeABI(),
    gas: gas || Gas.DEPOSIT_APPROVED_ERC20_GAS_USED,
    gasPrice
  }
}

export const getExit = async ({
  smallestUnitAmount,
  addresses,
  gasOptions
}) => {
  const { from } = addresses
  const { utxo } = smallestUnitAmount
  const { gas, gasPrice } = gasOptions
  const { utxo_pos, txbytes, proof } = await Plasma.ChildChain.getExitData(utxo)
  const { contract, address, bonds } = await Contract.getPaymentExitGame()
  return {
    from,
    to: address,
    value: bonds.standardExit,
    data: contract.methods
      .startStandardExit([utxo_pos.toString(), txbytes, proof])
      .encodeABI(),
    gas: gas || Gas.EXIT_ESTIMATED_GAS_USED,
    gasPrice
  }
}

export const getCreateExitQueue = async ({
  addresses,
  smallestUnitAmount,
  gasOptions
}) => {
  const { from } = addresses
  const { token } = smallestUnitAmount
  const { gas, gasPrice } = gasOptions
  const contract = Plasma.RootChain.plasmaContract
  const vaultId = token.contractAddress === ContractAddress.ETH_ADDRESS ? 1 : 2

  return {
    from,
    to: Plasma.RootChain.plasmaContractAddress,
    data: contract.methods
      .addExitQueue(vaultId, token.contractAddress)
      .encodeABI(),
    gas: gas || Gas.ADD_EXIT_QUEUE_GAS_USED,
    gasPrice
  }
}
