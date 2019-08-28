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

export const depositEth = (address, privateKey, weiAmount, options) => {
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

// const approveErc20 = ()

export const depositErc20 = async (
  address,
  privateKey,
  weiAmount,
  contractAddress,
  options
) => {
  const erc20ApproveABI = [
    {
      name: 'approve',
      type: 'function',
      constant: false,
      inputs: [
        {
          name: '_spender',
          type: 'address'
        },
        {
          name: '_value',
          type: 'uint256'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable'
    }
  ]

  const erc20Contract = new web3.eth.Contract(erc20ApproveABI, contractAddress)

  const nonce = await web3.eth.getTransactionCount(address)

  const txDetails = {
    from: address,
    to: contractAddress,
    nonce: nonce,
    data: erc20Contract.methods
      .approve(Config.PLASMA_CONTRACT_ADDRESS, weiAmount)
      .encodeABI(),
    gasPrice: options.gasPrice
  }

  const gas = await web3.eth.estimateGas(txDetails)

  const signedTx = await web3.eth.accounts.signTransaction(
    {
      ...txDetails,
      gas
    },
    privateKey
  )

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction)

  const depositTransaction = transaction.encodeDeposit(
    address,
    weiAmount,
    contractAddress
  )

  const txOptions = {
    from: address,
    privateKey
  }

  return rootChain.depositToken(depositTransaction, txOptions)
}
