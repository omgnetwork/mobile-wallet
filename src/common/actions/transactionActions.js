import { createAction } from './actionCreators'

export const invalidatePendingTx = (dispatch, resolvedTx) => {
  return createAction(dispatch, {
    type: 'TRANSACTION/INVALIDATE_PENDING_TX',
    operation: () => ({
      resolvedPendingTx: resolvedTx
    })
  })
}
