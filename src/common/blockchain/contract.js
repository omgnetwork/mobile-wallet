export const isApproved = async (erc20Contract, address, erc20VaultAddress) => {
  const allowance = await erc20Contract.methods
    .allowance(address, erc20VaultAddress)
    .call()

  return allowance !== '0'
}
