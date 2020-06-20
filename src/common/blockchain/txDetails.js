import { ContractAddress } from 'common/constants'
import { Plasma, web3 } from 'common/clients'
import { ContractABI } from 'common/blockchain'
import { Gas } from 'common/constants'

export const getTransferEth = (from, to, amount, fee) => {
  return {
    from,
    to,
    value: amount,
    gas: Gas.MINIMUM_GAS_USED,
    gasPrice: fee.amount
  }
}

export const getTransferErc20 = (from, to, amount, fee, contract) => {
  return {
    from,
    to: contract._address,
    data: contract.methods.transfer(to, amount).encodeABI(),
    gas: Gas.LOW_LIMIT,
    gasPrice: fee.amount
  }
}

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

export const getApproveErc20 = async (
  ownerAddress,
  tokenContractAddress,
  depositWeiAmount,
  gas,
  gasPrice
) => {
  const erc20Contract = new web3.eth.Contract(
    ContractABI.erc20Abi(),
    tokenContractAddress
  )
  const { address: erc20VaultAddress } = await Plasma.RootChain.getErc20Vault()

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
