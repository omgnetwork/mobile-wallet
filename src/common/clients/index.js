import { ChildChain, RootChain, OmgUtil } from '@omisego/omg-js'
import Config from 'react-native-config'
import Web3 from 'web3'

export const web3 = new Web3(
  new Web3.providers.HttpProvider(Config.WEB3_HTTP_PROVIDER),
  null,
  {
    transactionConfirmationBlocks: 1
  }
)

const rootchain = new RootChain({
  web3: web3,
  plasmaContractAddress: Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
})

// Assume Config.CHILDCHAIN_WATCHER_URL is always has '/' at the end.
const watcherUrl = Config.CHILDCHAIN_WATCHER_URL.slice(0, -1)
const childchain = new ChildChain({
  watcherUrl
})

export const Plasma = {
  RootChain: rootchain,
  ChildChain: childchain
}
export const PlasmaUtils = OmgUtil
