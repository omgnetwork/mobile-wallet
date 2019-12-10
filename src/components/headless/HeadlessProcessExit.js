import { Notification } from 'common/utils'
import { NotificationMessages } from 'common/constants'

export default async (
  startedExitTxs,
  dispatchUpdateStartedExitTxStatus,
  taskData
) => {
  try {
    const { taskId } = taskData
    dispatchUpdateStartedExitTxStatus(taskId, 'ready')

    const { value, symbol } = startedExitTxs.map(tx => tx.hash === taskId)
    Notification.create(
      NotificationMessages.NOTIFY_UTXO_IS_READY_TO_EXIT(value, symbol)
    )
    return Promise.resolve(taskId)
  } catch (err) {
    return Promise.reject(err)
  }
}
