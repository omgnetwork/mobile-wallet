import * as Sentry from '@sentry/react-native'

const isDev = typeof __DEV__ === 'boolean' && __DEV__

export const send = exception => {
  if (!isDev) {
    Sentry.captureException(exception)
  }
}

export const reportWhenError = (operation, errorHandler = () => null) => {
  try {
    return operation()
  } catch (exception) {
    console.log(exception)
    errorHandler(exception)
    send(exception)
  }
}
