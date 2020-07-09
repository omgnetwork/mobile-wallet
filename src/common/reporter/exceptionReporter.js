import * as Sentry from '@sentry/react-native'
import { Alerter } from 'common/utils'

const isDev = typeof __DEV__ === 'boolean' && __DEV__

export const send = exception => {
  if (!isDev) {
    Sentry.captureException(exception)
  }
}

export const reportWhenError = (operation, errorHandler = () => null) => {
  return operation().catch(exception => {
    Alerter.show({ type: 'danger', message: exception.message })
    errorHandler(exception)
    send(exception)
  })
}
