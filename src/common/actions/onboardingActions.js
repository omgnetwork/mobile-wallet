import { createAction } from './actionCreators'

export const setEnableOnboarding = (dispatch, enabled) => {
  const action = () => ({ enabled })
  return createAction(dispatch, {
    operation: action,
    type: 'ONBOARDING/ENABLED'
  })
}

export const addViewedPage = (dispatch, viewedPages, page) => {
  if (viewedPages.indexOf(page) === -1) {
    const action = () => ({ page })
    return createAction(dispatch, {
      operation: action,
      type: 'ONBOARDING/ADD_VIEWED_PAGE'
    })
  }
}

export const addViewedPopup = (dispatch, popup) => {
  const action = () => ({ popup })
  return createAction(dispatch, {
    operation: action,
    type: 'ONBOARDING/ADD_VIEWED_POPUP'
  })
}

export const setCurrentPopup = (dispatch, name, position) => {
  const action = () => ({ name, position })
  return createAction(dispatch, {
    operation: action,
    type: 'ONBOARDING/SET_CURRENT_POPUP'
  })
}
