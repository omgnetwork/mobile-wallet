import Config from 'react-native-config'
import createWeb3 from './web3'
import createRootchain from './rootchain'
import createChildchain from './childchain'
import { OmgUtil } from '@omisego/react-native-omg-js'

const web3HttpProvider = Config.WEB3_HTTP_PROVIDER
const plasmaContractAddress = Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
const watcherURL = Config.WATCHER_URL

export const web3 = createWeb3(web3HttpProvider)

export const Plasma = {
  RootChain: createRootchain(web3, plasmaContractAddress),
  ChildChain: createChildchain(watcherURL, plasmaContractAddress),
  Utils: OmgUtil
}
