import { ExceptionReporter } from 'common/reporter'

export const createAsyncAction = ({
  operation: doAsyncAction,
  type: actionType,
  isBackgroundTask,
  reportError = true
}) => {
  return dispatch => {
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
        if (reportError) {
          ExceptionReporter.send(err)
        }
      }
      const actionName = actionType.replace('/', '_')
      dispatch({ type: `LOADING/${actionName}/IDLE` })
    })
  }
}

export const createAction = (
  dispatch,
  { operation: doAction, type: actionType, reportError = true }
) => {
  try {
    const result = doAction()
    dispatch({ type: `${actionType}/OK`, data: result })
  } catch (err) {
    console.log(err)
    dispatch({ type: `${actionType}/ERROR`, data: err })
    if (reportError) {
      ExceptionReporter.send(err)
    }
  }
}
