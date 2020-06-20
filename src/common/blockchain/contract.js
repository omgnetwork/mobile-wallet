import { Plasma, web3 } from 'common/clients'
import { ContractABI } from 'common/blockchain'

export const getErc20Allowance = async (address, tokenContractAddress) => {
  const erc20Contract = new web3.eth.Contract(
    ContractABI.erc20Abi(),
    tokenContractAddress
  )
  const { address: erc20VaultAddress } = await Plasma.RootChain.getErc20Vault()

  return erc20Contract.methods.allowance(address, erc20VaultAddress).call()
}

export const getPaymentExitGame = () => {
  return Plasma.RootChain.getPaymentExitGame()
}

export const getPaymentExitGameABI = async () => {
  const paymentExitGame = await getPaymentExitGame()
  return paymentExitGame.contract.options.jsonInterface
}

export const getPlasmaContractAddress = () => {
  return Plasma.RootChain.plasmaContractAddress
}

export const getPlasmaContractABI = () => {
  const plasmaContract = Plasma.RootChain.plasmaContract
  return plasmaContract.options.jsonInterface
}

export const getEthVaultABI = async () => {
  const ethVault = await Plasma.RootChain.getEthVault()
  return ethVault.contract.options.jsonInterface
}

export const getERC20VaultABI = async () => {
  const ethVault = await Plasma.RootChain.getErc20Vault()
  return ethVault.contract.options.jsonInterface
}

export const getExitEvents = async (event, options) => {
  const { filter, fromBlock } = options
  const { contract } = await getPaymentExitGame()
  return contract.getPastEvents(event, {
    filter,
    fromBlock: fromBlock || 0
  })
}
