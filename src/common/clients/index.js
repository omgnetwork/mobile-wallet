import { ChildChain, RootChain, OmgUtil } from '@omisego/omg-js'
import Config from 'react-native-config'
import Web3 from 'web3'
import axios from 'axios'

const web3 = new Web3(
  new Web3.providers.HttpProvider(Config.WEB3_HTTP_PROVIDER),
  null,
  {
    transactionConfirmationBlocks: 1
  }
)

const rootchain = new RootChain(web3, Config.PLASMA_CONTRACT_ADDRESS)
const childchain = new ChildChain(Config.CHILDCHAIN_WATCHER_URL)

export const Plasma = {
  rootchain,
  childchain,
  transaction: OmgUtil.transaction
}
