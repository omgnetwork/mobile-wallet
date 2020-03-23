import { BigNumber } from 'common/utils'
export const isApproved = async (
  erc20Contract,
  address,
  amount,
  erc20VaultAddress
) => {
  const allowance = await erc20Contract.methods
    .allowance(address, erc20VaultAddress)
    .call()

  const transferAllowedAmount = BigNumber.create(allowance)
  const transferAmount = BigNumber.create(amount)

  return transferAllowedAmount.gte(transferAmount)
}
