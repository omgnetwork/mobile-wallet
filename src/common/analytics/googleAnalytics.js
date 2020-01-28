import firebase from 'react-native-firebase'
import Config from 'react-native-config'

const envInfo = {
  ethereumNetwork: Config.ETHERSCAN_NETWORK,
  watcherURL: Config.CHILDCHAIN_WATCHER_URL,
  plasmaContractAddress: Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
}

export const sendEvent = (eventName, params) => {
  try {
    return firebase.analytics().logEvent(eventName, {
      ...params,
      ...envInfo
    })
  } catch (err) {
    console.log(err)
  }
}
