export const loadingStatusReducer = (state = 'DEFAULT', action) => {
  const status = action.type.split('/')[2]
  if (['INITIATED', 'SUCCESS', 'FAILED', 'DEFAULT'].indexOf(status) > -1) {
    return status
  } else {
    return state
  }
}
