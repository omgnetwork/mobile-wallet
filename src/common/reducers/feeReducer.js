export const feeReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CHILDCHAIN/FEES/SUCCESS': {
      return action.data
    }
    default: {
      return state
    }
  }
}
