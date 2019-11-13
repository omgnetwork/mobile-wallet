// Template
// {
//   "onboarding": {
//     "enabled": true,
//     "viewedPages": ["plasma-wallet", "ethereum-wallet"],
//     "viewedPopups": ["plasma-wallet", "ethereum-wallet", "childchain-network", "rootchain-network"],
//     "currentPopup": {
//       "position_y": 100,
//       "name": "ethereum-wallet"
//     }
//   }
// }

export const onboardingReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ONBOARDING/ENABLED/OK':
      return action.data.enabled
        ? { ...state, enabled: true }
        : {
            enabled: false,
            viewedPages: [],
            viewedPopups: [],
            currentPopup: {}
          }
    case 'ONBOARDING/ADD_VIEWED_PAGE/OK':
      return {
        ...state,
        viewedPages: [...state.viewedPages, action.data.page]
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
