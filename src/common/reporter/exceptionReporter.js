import * as Sentry from '@sentry/react-native'
import Config from 'react-native-config'

export const send = exception => {
  if (Config.ETHEREUM_NETWORK === 'mainnet') {
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
