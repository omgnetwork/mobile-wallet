import * as Sentry from '@sentry/react-native'
import Config from 'react-native-config'

const isDev = typeof __DEV__ === 'boolean' && __DEV__
export const send = exception => {
  if (Config.ETHEREUM_NETWORK === 'mainnet' && !isDev) {
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
