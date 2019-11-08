import firebase from 'react-native-firebase'

export const log = error => {
  firebase.crashlytics().log(error.message)
}
