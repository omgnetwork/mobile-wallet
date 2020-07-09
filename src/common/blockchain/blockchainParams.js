import { Unit } from 'common/utils'

export const createSendTransactionParams = ({
  blockchainWallet,
  toAddress,
  token,
  amount,
  gas,
  gasPrice,
  gasToken,
  feeToken,
  feeUtxo,
  utxo
}) => {
  const { address: from, privateKey } = blockchainWallet
  const to = toAddress
  return {
    addresses: { from, to },
    smallestUnitAmount: {
      token,
      utxo,
      amount: Unit.convertToString(amount, 0, token.tokenDecimal)
    },
    privateKey,
    gasOptions: { gas, gasPrice, gasToken, feeToken, feeUtxo }
  }
}
