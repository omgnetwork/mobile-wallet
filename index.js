/**
 * @format
 */

import process from 'process'
import buffer from 'buffer'
process.version = '4.0'

import { AppRegistry } from 'react-native'
import App from './src'
import { name as appName } from './app.json'
import './shim.js'
AppRegistry.registerComponent(appName, () => App)
