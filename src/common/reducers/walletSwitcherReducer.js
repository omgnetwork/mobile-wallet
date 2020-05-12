export const walletSwitcherReducer = (state = { visible: false }, action) => {
  switch (action.type) {
    case 'WALLET_SWITCHER/TOGGLE/OK':
      return {
        ...state,
        visible: action.data.visible
      }
    default:
      return state
  }
}
