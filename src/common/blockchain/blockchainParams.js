import { Unit } from 'common/utils'

export const toSendTransactionParams = ({
  blockchainWallet,
  toAddress,
  token,
  amount,
  gas,
  fee
}) => {
  const { address: from, privateKey } = blockchainWallet
  const to = toAddress
  return {
    addresses: { from, to },
    smallestUnitAmount: Unit.convertToString(amount, 0, token.tokenDecimal),
    privateKey,
    gasOptions: { gas, gasPrice: fee.amount }
  }
}
