export const gasReducer = (state = [], action) => {
  switch (action.type) {
    case 'ROOTCHAIN/GET_RECOMMENDED_GAS/SUCCESS': {
      return action.data
    }
    default: {
      return state
    }
  }
}
