import PushNotification from 'react-native-push-notification'

export const create = ({ title, message }) => {
  PushNotification.localNotification({ title, message })
}