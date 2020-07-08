import { createAction } from './actionCreators'

export const addTokenContractInfo = (dispatch, info) => {
  return createAction(dispatch, {
    operation: () => info,
    type: 'TOKEN/ADD'
  })
}
