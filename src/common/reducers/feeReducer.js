export const feeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHILDCHAIN/FEES/SUCCESS': {
      console.log(action.data)
      return action.data
    }
    default: {
      return state
    }
  }
}
