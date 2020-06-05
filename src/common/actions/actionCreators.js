import * as Sentry from '@sentry/react-native'

export const createAsyncAction = ({
  operation: doAsyncAction,
  type: actionType,
  isBackgroundTask: isBackgroundTask
}) => {
  return async dispatch => {
    const actionStartStatus = isBackgroundTask ? 'LISTENING' : 'INITIATED'
    dispatch({ type: `${actionType}/${actionStartStatus}` })
    return requestAnimationFrame(async () => {
      try {
        const result = await doAsyncAction()
        if (result) {
          dispatch({ type: `${actionType}/SUCCESS`, data: result })
        }
      } catch (err) {
        console.log(err)
        dispatch({ type: `${actionType}/FAILED`, err })
        if (!__DEV__) {
          Sentry.captureException(err)
        }
      }
      const actionName = actionType.replace('/', '_')
      dispatch({ type: `LOADING/${actionName}/IDLE` })
    })
  }
}

export const createAction = (
  dispatch,
  { operation: doAction, type: actionType }
) => {
  try {
    const result = doAction()
    dispatch({ type: `${actionType}/OK`, data: result })
  } catch (err) {
    console.log(err)
    dispatch({ type: `${actionType}/ERROR`, data: err })
    if (!__DEV__) {
      Sentry.captureException(err)
    }
  }
}
