import { TransactionTypes } from 'common/constants'

export const getBlockchainTextActionLabel = tx => {
  switch (tx.type) {
    case TransactionTypes.TYPE_RECEIVED:
      return 'Received with'
    case TransactionTypes.TYPE_SENT:
      return 'Sent with'
    case TransactionTypes.TYPE_DEPOSIT:
      return 'Deposited with'
    case TransactionTypes.TYPE_EXIT:
      return 'Requested withdraw from'
    default:
      return 'Transfered with'
  }
}
