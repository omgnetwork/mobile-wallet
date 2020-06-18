import { ContractAddress } from 'common/constants'
import { Plasma } from 'common/clients'

export const getDeposit = async (
  tokenContractAddress,
  from,
  amount,
  gas,
  gasPrice
) => {
  const _amount = amount.toString()
  const isEth = tokenContractAddress === ContractAddress.ETH_ADDRESS
  const { address, contract } = isEth
    ? await Plasma.RootChain.getEthVault()
    : await Plasma.RootChain.getErc20Vault()

  const depositTx = Plasma.Utils.transaction.encodeDeposit(
    from,
    _amount,
    tokenContractAddress
  )

  return {
    from,
    to: address,
    ...(isEth ? { value: _amount } : {}),
    data: contract.methods.deposit(depositTx).encodeABI(),
    gas,
    gasPrice
  }
}

export const getApproveErc20 = (
  ownerAddress,
  tokenContractAddress,
  erc20Contract,
  erc20VaultAddress,
  depositWeiAmount,
  gas,
  gasPrice
) => {
  if (!ownerAddress) throw new Error('ownerAddress is missing')
  if (!tokenContractAddress) throw new Error('tokenContractAddress is missing')
  if (!erc20Contract) throw new Error('erc20Contract is missing')
  if (!erc20VaultAddress) throw new Error('erc20VaultAddress is missing')
  if (!depositWeiAmount) throw new Error('depositWeiAmount is missing')
  if (!gas) throw new Error('gas is missing')
  if (!gasPrice) throw new Error('gasPrice is missing')

  return {
    from: ownerAddress,
    to: tokenContractAddress,
    gas: gas,
    gasPrice: gasPrice,
    data: erc20Contract.methods
      .approve(erc20VaultAddress, depositWeiAmount)
      .encodeABI()
  }
}
