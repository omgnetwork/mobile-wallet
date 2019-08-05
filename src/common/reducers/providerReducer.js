export const providerReducer = (state = null, action) => {
  switch (action.type) {
    case 'PROVIDER/SET/SUCCESS':
    case 'PROVIDER/SYNC/SUCCESS':
      return action.data
    default:
      return state
  }
}
