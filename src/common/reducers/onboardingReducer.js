// Template
// {
//   "onboarding": {
//     "enabled": true,
//     "currentPage": "plasma-wallet",
//     "viewedPopups": ["plasma-wallet", "ethereum-wallet", "childchain-network", "rootchain-network"],
//     "currentPopup": {
//       "position_y": 100,
//       "name": "ethereum-wallet"
//     }
//   }
// }

export const onboardingReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ONBOARDING/SET_ENABLED/OK':
      return action.data.enabled
        ? { ...state, enabled: true }
        : {
            enabled: false,
            currentPage: null,
            viewedPopups: []
          }
    case 'ONBOARDING/SET_CURRENT_PAGE/OK':
      return {
        ...state,
        currentPage: action.data.page
      }
    case 'ONBOARDING/ADD_VIEWED_POPUP/OK':
      return {
        ...state,
        viewedPopups: [...state.viewedPopups, action.data.popup]
      }
    case 'ONBOARDING/SET_CURRENT_POPUP/OK':
      return {
        ...state,
        currentPopup: action.data
      }
    default:
      return state
  }
}
