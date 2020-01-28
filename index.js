/**
 * @format
 */

import process from 'process'
import buffer from 'buffer'
process.version = '4.0'
import 'ethers/dist/shims.js'
import './shim.js'

import { AppRegistry } from 'react-native'
import App from './src'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
