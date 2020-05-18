import Config from 'react-native-config'
import createWeb3 from './web3'
import createRootchain from './rootchain'
import createChildchain from './childchain'

const web3HttpProvider = Config.WEB3_HTTP_PROVIDER
const plasmaContractAddress = Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS

export const web3 = createWeb3(web3HttpProvider)

export const Plasma = {
  RootChain: createRootchain(web3, plasmaContractAddress),
  ChildChain: createChildchain(Config.WATCHER_URL)
}
