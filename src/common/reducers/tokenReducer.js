export const tokenReducer = (state = {}, action) => {
  switch (action.type) {
    case 'TOKEN/UPDATE_CACHE':
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}
