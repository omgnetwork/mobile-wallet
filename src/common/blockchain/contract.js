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

export const getExitEvents = async (event, options) => {
  const { filter, fromBlock } = options
  const { contract } = await getPaymentExitGame()
  return contract.getPastEvents(event, {
    filter,
    fromBlock: fromBlock || 0
  })
}

export const isPaymentExitGameContract = async (web3, address) => {
  const code = await web3.eth.getCode(address)
  const hash = web3.eth.abi.encodeFunctionSignature(
    'startStandardExitBondSize()'
  )
  // Remove 0x prefix
  return code.indexOf(hash.slice(2)) > -1
}
