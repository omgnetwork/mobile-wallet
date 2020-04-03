import { TransactionTypes } from 'common/constants'

export const getBlockchainTextActionLabel = tx => {
  switch (tx.type) {
    case TransactionTypes.TYPE_RECEIVED:
      return 'Received on'
    case TransactionTypes.TYPE_SENT:
      return 'Sent on'
    case TransactionTypes.TYPE_DEPOSIT:
      return 'Deposited to'
    case TransactionTypes.TYPE_EXIT:
      return 'Requested exit from'
    default:
      return 'Transfered on'
  }
}
