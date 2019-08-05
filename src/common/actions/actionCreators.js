export const createAsyncAction = ({
  operation: doAsyncAction,
  type: actionType
}) => {
  return async dispatch => {
    dispatch({ type: `${actionType}/INITIATED` })
    requestAnimationFrame(async () => {
      try {
        const result = await doAsyncAction()
        dispatch({ type: `${actionType}/SUCCESS`, data: result })
      } catch (err) {
        console.log(err)
        dispatch({ type: `${actionType}/FAILED`, data: err })
      }
      const loadingType = actionType.replace('/', '_')
      dispatch({ type: `LOADING/${loadingType}/DEFAULT` })
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
