import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'
import { TransitionPresets } from 'react-navigation-stack'

export default createStackNavigator(
  {
    BackupList: Views.BackupList,
    BackupWarning: Views.BackupWarning,
    BackupTranscribe: Views.BackupTranscribe
  },
  {
    initialRouteName: 'BackupList',
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      cardStyle: { opacity: 1, backgroundColor: 'transparent' }
    }
  }
)
