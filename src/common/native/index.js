import { NativeModules } from 'react-native'
import * as SecureEncryption from './secureEncryption'

const TaskScheduler = NativeModules.TaskScheduler

export { TaskScheduler, SecureEncryption }
