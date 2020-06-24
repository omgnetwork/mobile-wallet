import { ethers } from 'ethers'
import { web3 } from 'common/clients'
import axios from 'axios'
import Config from 'react-native-config'
import BN from 'bn.js'
import { TxDetails, Contract, Wait } from 'common/blockchain'

export const sendEthToken = sendTransactionParams => {
  const txDetails = TxDetails.getTransferEth(sendTransactionParams)
  return signSendTx(txDetails, sendTransactionParams.privateKey)
}

export const sendErc20Token = async sendTransactionParams => {
  const txDetails = TxDetails.getTransferErc20(sendTransactionParams)
  return signSendTx(txDetails, sendTransactionParams.privateKey)
}

export const isRequireApproveErc20 = async ({
  addresses,
  smallestUnitAmount
}) => {
  const { from } = addresses
  const { token, amount } = smallestUnitAmount

  const allowance = await Contract.getErc20Allowance(
    from,
    token.contractAddress
  )

  const bnAmount = new BN(amount)
  const bnAllowance = new BN(allowance)

  return bnAllowance.lt(bnAmount)
}

export const approveErc20Deposit = async sendTransactionParams => {
  const { from } = sendTransactionParams.addresses
  const { token, amount } = sendTransactionParams.smallestUnitAmount
  const allowance = await Contract.getErc20Allowance(
    from,
    token.contractAddress
  )

  const bnAllowance = new BN(allowance)
  const bnAmount = new BN(amount)
  const bnZero = new BN(0)

  // If the allowance less than the desired amount, we need to reset to zero first inorder to update it.
  // Some erc20 contract prevent to update non-zero allowance e.g. OmiseGO Token.
  if (bnAllowance.gt(bnZero) && bnAllowance.lt(bnAmount)) {
    const txDetails = await TxDetails.getApproveErc20({
      ...sendTransactionParams,
      smallestUnitAmount: {
        ...sendTransactionParams.smallestUnitAmount,
        amount: 0
      }
    })
    const { hash } = await signSendTx(
      txDetails,
      sendTransactionParams.privateKey
    )

    // Wait approve transaction for 1 block
    await Wait.waitForRootchainTransaction({
      hash,
      intervalMs: 3000,
      confirmationThreshold: 1
    })
  }

  const txDetails = await TxDetails.getApproveErc20(sendTransactionParams)
  const { hash } = await signSendTx(txDetails, sendTransactionParams.privateKey)

  await Wait.waitForRootchainTransaction({
    hash,
    intervalMs: 3000,
    confirmationThreshold: 1
  })

  return { hash }
}

export const importWalletMnemonic = mnemonic => {
  return ethers.Wallet.fromMnemonic(mnemonic)
}

// ethers.utils.HDNode.entropyToMnemonic is possible to return duplicated values.
// This function will make sure that the mnemonic will always has unique values.
export const generateWalletMnemonic = () => {
  let mnemonic, valid
  while (!valid) {
    mnemonic = ethers.utils.HDNode.entropyToMnemonic(
      ethers.utils.randomBytes(16)
    )
    const words = mnemonic.split(' ')
    const totalUniqueWords = new Set(words).size
    const totalWords = words.length
    if (totalUniqueWords === totalWords) {
      valid = true
    }
  }
  return mnemonic
}

export const importWalletPrivateKey = privateKey => {
  return new ethers.Wallet(privateKey)
}

// Transaction Management
export const getERC20Txs = (address, options) => {
  const { lastEthBlockNumber, limit, page } = options
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'desc',
      apikey: Config.ETHERSCAN_API_KEY,
      offset: limit || 0,
      page: page || 1,
      address: address,
      action: 'tokentx',
      startblock: lastEthBlockNumber || '0',
      endblock: '99999999'
    }
  })
}

export const getTxs = (address, options) => {
  const { lastEthBlockNumber, limit, page } = options
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'desc',
      apikey: Config.ETHERSCAN_API_KEY,
      address: address,
      offset: limit || 0,
      page: page || 1,
      action: 'txlist',
      startblock: lastEthBlockNumber || '0',
      endblock: '99999999'
    }
  })
}

export const getInternalTxs = (address, options) => {
  const { lastBlockNumber, limit, page } = options
  return axios.get(Config.ETHERSCAN_API_URL, {
    params: {
      module: 'account',
      sort: 'desc',
      apikey: Config.ETHERSCAN_API_KEY,
      address: address,
      offset: limit || 0,
      page: page || 1,
      action: 'txlistinternal',
      startblock: lastBlockNumber || '0',
      endblock: '99999999'
    }
  })
}

export const getGasFromGasStation = () => {
  return axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(response => response.data)
}

export const getContract = (tokenContractAddress, abi) => {
  return new web3.eth.Contract(abi, tokenContractAddress)
}

export const createProvider = providerName => {
  return ethers.getDefaultProvider(providerName)
}

export const signSendTx = async (txDetails, privateKey) => {
  const signedTx = await web3.eth.accounts.signTransaction(
    txDetails,
    privateKey
  )

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, hash) => {
      if (error) return reject(error)
      return resolve({ hash })
    })
  })
}
