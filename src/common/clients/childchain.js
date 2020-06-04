import { ChildChain } from '@omisego/react-native-omg-js'

export default (watcherUrl, plasmaContractAddress) =>
  new ChildChain({
    watcherUrl: watcherUrl.endsWith('/') ? watcherUrl.slice(0, -1) : watcherUrl,
    plasmaContractAddress
  })
