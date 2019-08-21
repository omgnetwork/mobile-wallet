export const loadingReducer = (
  state = { action: null, show: false },
  action
) => {
  const [actionType, actionName, status] = action.type.split('/')
  if (['INITIATED', 'SUCCESS', 'FAILED'].indexOf(status) > -1) {
    return {
      action: `${actionType}_${actionName}`,
      show: status === 'INITIATED',
      failed: status === 'FAILED',
      success: status === 'SUCCESS'
    }
  } else {
    return state
  }
}
