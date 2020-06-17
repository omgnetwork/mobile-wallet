import * as Sentry from '@sentry/react-native'

export const send = exception => {
  if (!__DEV__) {
    Sentry.captureException(exception)
  }
}

export const reportWhenError = (operation, errorHandler) => {
  try {
    return operation()
  } catch (exception) {
    console.log(exception)
    errorHandler(exception)
    send(exception)
  }
}
