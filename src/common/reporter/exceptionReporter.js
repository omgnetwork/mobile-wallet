import * as Sentry from '@sentry/react-native'

export const send = exception => {
  if (!__DEV__) {
    Sentry.captureException(exception)
  }
}
