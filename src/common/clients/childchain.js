import { ChildChain } from '@omisego/react-native-omg-js'

// Assume Config.WATCHER_URL is always has '/' at the end.
export default watcherUrl =>
  new ChildChain({
    watcherUrl: watcherUrl.endsWith('/') ? watcherUrl : `${watcherUrl}/`
  })
