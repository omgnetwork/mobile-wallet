import { Plasma } from 'common/clients'

export const allowanceTokenForTransfer = async (
  erc20Contract,
  address,
  erc20VaultAddress
) => {
  return erc20Contract.methods.allowance(address, erc20VaultAddress).call()
}

export const getPaymentExitGame = () => {
  return Plasma.RootChain.getPaymentExitGame()
}

export const getPlasmaContractAddress = () => {
  return Plasma.RootChain.plasmaContractAddress
}

export const getPlasmaAbi = () => {
  return Plasma.RootChain.plasmaContract.options.jsonInterface
}

export const getExitEvents = async (event, options) => {
  const { filter, fromBlock } = options
  const { contract } = await getPaymentExitGame()
  return contract.getPastEvents(event, {
    filter,
    fromBlock: fromBlock || 0
  })
}
