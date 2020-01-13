import { Gas, ContractAddress } from 'common/constants'
import { Ethereum } from 'common/blockchain'
import { ContractABI, Parser } from 'common/utils'

export const estimateTransferErc20 = (wallet, to, fee, token) => {
  const abi = ContractABI.erc20Abi()
  const contract = new Ethereum.getContract(token.contractAddress, abi, wallet)
  const amount = Parser.parseUnits(token.balance, token.numberOfDecimals)
  const gasOptions = {
    gasLimit: Gas.LOW_LIMIT,
    gasPrice: Parser.parseUnits(fee.amount, 'wei')
  }

  return contract.estimate.transfer(to, amount, gasOptions)
}

export const estimateTransferETH = () => {
  return Promise.resolve('21000')
}

export const estimateDeposit = token => {
  const isEth = token.contractAddress === ContractAddress.ETH_ADDRESS
  const gasUsed =
    Gas.DEPOSIT_ESTIMATED_GAS_USED +
    (isEth ? 0 : Gas.DEPOSIT_APPROVED_ERC20_GAS_USED)
  return Promise.resolve(gasUsed)
}

export const estimateTransferChildchain = () => {
  return Promise.resolve(1)
}
