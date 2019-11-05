import firebase from 'react-native-firebase'

export const sendEvent = (eventName, params) =>
  firebase.analytics().logEvent(eventName, params)
