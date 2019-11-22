export const createDepositOptions = (
  ownerAddress,
  ownerPrivateKey,
  gas,
  gasPrice
) => {
  if (!ownerAddress) throw new Error('ownerAddress is missing')
  if (!ownerPrivateKey) throw new Error('ownerPrivateKey is missing')
  if (!gas) throw new Error('gas is missing')
  if (!gasPrice) throw new Error('gasPrice is missing')

  return {
    from: ownerAddress,
    privateKey: ownerPrivateKey,
    gas: gas,
    gasPrice: gasPrice
  }
}

export const createApproveErc20Options = (
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
