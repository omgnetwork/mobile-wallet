import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

export const create = ({ title, message }) => {
  PushNotification.localNotification({ title, message })
}

export const init = () => {
  PushNotification.configure({
    onNotification: function(notification) {
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },

    permissions: {
      alert: true,
      badge: true,
      sound: true
    }
  })
}
