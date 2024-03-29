import firebase from 'react-native-firebase'
import Config from 'react-native-config'

const envInfo = {
  ethereumNetwork: Config.ETHEREUM_NETWORK,
  watcherURL: Config.WATCHER_URL,
  plasmaContractAddress: Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
}

export const send = (eventName, params) => {
  try {
    return firebase.analytics().logEvent(eventName, {
      ...params,
      ...envInfo
    })
  } catch (err) {
    console.log(err)
  }
}
