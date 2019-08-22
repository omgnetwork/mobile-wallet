import PushNotification from 'react-native-push-notification'

export const create = ({ title, message }) => {
  return PushNotification.localNotification({ title, message })
}
