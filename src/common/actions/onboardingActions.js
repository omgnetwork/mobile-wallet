import { createAction } from './actionCreators'

export const setEnableOnboarding = (dispatch, enabled) => {
  const action = () => ({ enabled })
  return createAction(dispatch, {
    operation: action,
    type: 'ONBOARDING/SET_ENABLED'
  })
}

export const setCurrentPage = (dispatch, currentPage, page) => {
  if (page !== currentPage) {
    const action = () => ({ page })
    return createAction(dispatch, {
      operation: action,
      type: 'ONBOARDING/SET_CURRENT_PAGE'
    })
  }
}

export const addViewedPopup = (dispatch, viewedPopups, popup) => {
  if (!popup || viewedPopups.indexOf(popup) > -1) return
  const action = () => ({ popup })
  return createAction(dispatch, {
    operation: action,
    type: 'ONBOARDING/ADD_VIEWED_POPUP'
  })
}

export const setCurrentPopup = (dispatch, name) => {
  const action = () => ({ name })
  return createAction(dispatch, {
    operation: action,
    type: 'ONBOARDING/SET_CURRENT_POPUP'
  })
}

export const addAnchoredComponent = (dispatch, name, position) => {
  const { top, bottom, width, left, arrowOffset } = position
  const action = () => ({ name, top, bottom, width, left, arrowOffset })
  return createAction(dispatch, {
    operation: action,
    type: 'ONBOARDING/ADD_ANCHORED_COMPONENT'
  })
}
