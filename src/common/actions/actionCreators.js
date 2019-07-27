export const createAsyncAction = ({
  operation: doAsyncAction,
  type: actionType
}) => {
  return async dispatch => {
    try {
      dispatch({ type: `${actionType}/INITIATED` })
      const result = await doAsyncAction()
      dispatch({ type: `${actionType}/SUCCESS`, data: result })
    } catch (err) {
      console.log(err)
      dispatch({ type: `${actionType}/FAILED`, data: err })
    }
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
