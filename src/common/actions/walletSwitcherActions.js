import { createAction } from './actionCreators'

// This is a workaround when the drawer component can't talk directly to the action sheet component.
export const toggle = (dispatch, visible) => {
  const action = () => ({ visible })

  return createAction(dispatch, {
    operation: action,
    type: 'WALLET_SWITCHER/TOGGLE'
  })
}
