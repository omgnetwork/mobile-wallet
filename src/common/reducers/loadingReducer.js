export const loadingReducer = (
  state = { action: null, show: false },
  action
) => {
  const [actionSubject, actionVerb, actionStatus] = action.type.split('/')
  const actionName = `${actionSubject}_${actionVerb}`
  switch (actionStatus) {
    case 'INITIATED':
      return {
        action: actionName,
        show: true,
        failed: false,
        success: false
      }
    case 'SUCCESS':
      return {
        action: actionName,
        show: false,
        failed: false,
        success: true
      }
    case 'FAILED':
      return {
        action: actionName,
        show: false,
        failed: true,
        success: false
      }
    case 'IDLE':
      return {
        action: null,
        show: false,
        failed: false,
        success: false
      }
    default:
      return state
  }
}
