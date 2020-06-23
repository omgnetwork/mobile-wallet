import { Unit } from 'common/utils'

export const toSendTransactionParams = ({
  blockchainWallet,
  toAddress,
  token,
  amount,
  gas,
  gasPrice,
  gasToken
}) => {
  const { address: from, privateKey } = blockchainWallet
  const to = toAddress
  return {
    addresses: { from, to },
    smallestUnitAmount: {
      token,
      amount: Unit.convertToString(amount, 0, token.tokenDecimal)
    },
    privateKey,
    gasOptions: { gas, gasPrice, gasToken }
  }
}
