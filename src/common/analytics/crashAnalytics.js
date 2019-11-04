import firebase from 'react-native-firebase'

export const recordError = (title, error) =>
  firebase.crashlytics().recordCustomError(title, error.message, error.stack)
