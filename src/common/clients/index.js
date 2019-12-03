import { ChildChain, RootChain, OmgUtil } from '@omisego/omg-js'
import Config from 'react-native-config'
import Web3 from 'web3'

const web3 = new Web3(
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
const childchain = new ChildChain({ watcherUrl: Config.CHILDCHAIN_WATCHER_URL })

export const Plasma = {
  rootchain,
  childchain,
  transaction: OmgUtil.transaction
}
