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
        console.log(err)
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
    dispatch({ type: `${actionType}/SUCCESS`, data: result })
  } catch (err) {
    console.log(err)
    dispatch({ type: `${actionType}/FAILED`, data: err })
  }
}
