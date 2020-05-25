import { ChildChain } from '@omisego/react-native-omg-js'

export default watcherUrl =>
  new ChildChain({
    watcherUrl: watcherUrl.endsWith('/') ? watcherUrl.slice(0, -1) : watcherUrl
  })
