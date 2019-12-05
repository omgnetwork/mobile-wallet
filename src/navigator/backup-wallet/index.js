import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    BackupList: Views.BackupList,
    BackupWarning: Views.BackupWarning,
    BackupTranscribe: Views.BackupTranscribe
  },
  {
    initialRouteName: 'BackupList',
    headerMode: 'none'
  }
)
