import { ChildChain } from '@omisego/react-native-omg-js'

export default watcherUrl =>
  new ChildChain({
    watcherUrl: watcherUrl.endsWith('/') ? watcherUrl : `${watcherUrl}/`
  })
