import { createStackNavigator } from 'react-navigation'
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
