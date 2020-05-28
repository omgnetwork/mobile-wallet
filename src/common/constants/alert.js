export const SUCCESS_COPIED_ADDRESS = {
  type: 'success',
  message: 'Copied!'
}

export const FAILED_ADD_DUPLICATED_WALLET = {
  type: 'danger',
  message: 'The wallet name has already been taken.'
}

export const FAILED_ADD_EMPTY_WALLET_NAME = {
  type: 'danger',
  message: 'The wallet name should not be empty'
}

export const CANNOT_DEPOSIT_PENDING_TRANSACTION = {
  type: 'warning',
  message: 'Please wait until the pending transaction completed.'
}

export const CANNOT_EXIT_PENDING_TRANSACTION = {
  type: 'warning',
  message: 'Please wait until the pending transaction completed.'
}

export const CANNOT_EXIT_NOT_ENOUGH_ASSETS = {
  type: 'warning',
  message: "There're no assets to withdraw."
}

export const FAILED_DEPOSIT_EMPTY_WALLET = {
  type: 'warning',
  message: "There's no assets to deposit."
}
