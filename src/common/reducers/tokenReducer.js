export const tokenReducer = (state = {}, action) => {
  switch (action.type) {
    case 'TOKEN/ADD/OK':
      return {
        ...state,
        ...action.data
      }
    default:
      return state
  }
}
