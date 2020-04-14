export const errorReducer = (state = null, action) => {
  const [actionSubject, actionVerb, actionStatus] = action.type.split('/')
  const actionName = `${actionSubject}_${actionVerb}`
  switch (actionStatus) {
    case 'FAILED':
      return {
        action: actionName,
        message: action.err.message
      }
    case 'SUCCESS':
      return null
    default:
      return state
  }
}
