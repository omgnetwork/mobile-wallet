import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

export const create = ({ title, message }) => {
  PushNotification.localNotification({ title, message })
}

export const init = () => {
  PushNotification.configure({
    onNotification: function(notification) {
      console.log('NOTIFICATION:', notification)

      // process the notification

      // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true
    }
  })
}
