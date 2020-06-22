import 'ethers/dist/shims.js'
import App from './src'
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import * as Sentry from '@sentry/react-native'
import Config from 'react-native-config'

const isDev = typeof __DEV__ === 'boolean' && __DEV__

if (!isDev) {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.SENTRY_ENVIRONMENT,
    enableAutoSessionTracking: true
  })
}

AppRegistry.registerComponent(appName, () => App)
