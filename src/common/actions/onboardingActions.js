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
  console.log(viewedPopups, popup)
  if (!popup || viewedPopups.indexOf(popup) > -1) return
  console.log(viewedPopups.indexOf(popup) > -1)
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
