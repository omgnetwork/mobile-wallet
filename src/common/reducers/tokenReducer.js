export const tokenReducer = (state = {}, action) => {
  switch (action.type) {
    case 'TOKEN/UPDATE_CACHE':
      console.log(action.data)
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}
