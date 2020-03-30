/**
 * @format
 */

import buffer from 'buffer'
import 'ethers/dist/shims.js'

import { AppRegistry } from 'react-native'
import App from './src'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
