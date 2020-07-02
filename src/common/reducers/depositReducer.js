export const depositReducer = (
  state = {
    deposits: []
  },
  action
) => {
  switch (action.type) {
    case 'DEPOSITS/ALL/SUCCESS':
      return { ...state, deposits: action.data.deposits }
    default:
      return state
  }
}
