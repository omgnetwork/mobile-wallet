import { ChildChain, RootChain, OmgUtil } from '@omisego/omg-js'
import Config from 'react-native-config'
import Web3 from 'web3'

const { transaction } = OmgUtil

const web3 = new Web3(
  new Web3.providers.HttpProvider(Config.WEB3_HTTP_PROVIDER),
  null,
  {
    transactionConfirmationBlocks: 1
  }
)
const rootChain = new RootChain(web3, Config.PLASMA_CONTRACT_ADDRESS)
const childChain = new ChildChain(Config.PLASMA_WATCHER_URL)

export const getEthBalance = address => {
  return childChain.getBalance(address)
}

export const depositEth = async (address, privateKey, weiAmount, options) => {
  const depositTransaction = transaction.encodeDeposit(
    address,
    weiAmount,
    transaction.ETH_CURRENCY
  )

  const txOptions = {
    from: address,
    privateKey,
    ...options
  }

  return rootChain.depositEth(depositTransaction, weiAmount, txOptions)
}
