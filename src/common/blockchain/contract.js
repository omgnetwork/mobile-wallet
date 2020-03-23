export const allowanceTokenForTransfer = async (
  erc20Contract,
  address,
  erc20VaultAddress
) => {
  return erc20Contract.methods.allowance(address, erc20VaultAddress).call()
}
