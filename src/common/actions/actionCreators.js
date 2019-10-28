import { CrashReporter } from 'reporters'

export const createAsyncAction = ({
  operation: doAsyncAction,
  type: actionType,
  isBackgroundTask: isBackgroundTask
}) => {
  return async dispatch => {
    const actionStartStatus = isBackgroundTask ? 'LISTENING' : 'INITIATED'
    dispatch({ type: `${actionType}/${actionStartStatus}` })
    requestAnimationFrame(async () => {
      try {
        const result = await doAsyncAction()
        dispatch({ type: `${actionType}/SUCCESS`, data: result })
      } catch (err) {
        console.log(
          `%c [ERROR] ${err.message}`,
          'font-weight: bold; color: #ff0000'
        )
        // CrashReporter.reportError(err)
        dispatch({ type: `${actionType}/FAILED`, data: err })
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
    // CrashReporter.reportError(err)
    console.log(
      `%c [ERROR] ${err.message}`,
      'font-weight: bold; color: #ff0000'
    )
    dispatch({ type: `${actionType}/ERROR`, data: err })
  }
}
