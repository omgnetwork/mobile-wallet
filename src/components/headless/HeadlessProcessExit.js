import { Notification } from 'common/utils'
import { NotificationMessages } from 'common/constants'
import { transactionActions } from 'common/actions'
import { Transaction } from 'common/blockchain'
export default async (store, taskData) => {
  try {
    const { taskId } = taskData
    const startedExitTxs = store.getState().transaction.startedExitTxs
    const confirmedStartedExitTxs = startedExitTxs.filter(
      Transaction.isConfirmedStartedExitTx
    )
    const processExitReadyTx = confirmedStartedExitTxs.find(
      tx => tx.hash === taskId
    )

    if (processExitReadyTx) {
      const { value, symbol } = processExitReadyTx
      transactionActions.updateStartedExitTxStatus(
        store.dispatch,
        taskId,
        'ready'
      )
      Notification.create(
        NotificationMessages.NOTIFY_UTXO_IS_READY_TO_EXIT(value, symbol)
      )
      return Promise.resolve(taskId)
    } else {
      return Promise.reject('The transaction is not found')
    }
  } catch (err) {
    return Promise.reject(err)
  }
}
