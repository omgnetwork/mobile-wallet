import { createAsyncAction, createAction } from './actionCreators'

import { ChildChain, RootChain, OmgUtil } from '@omisego/omg-js'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

export const depositEth = () => {
  const asyncAction = async () => {
    const { transaction } = OmgUtil

    const web3 = new Web3(
      new Web3.providers.HttpProvider('https://rinkeby.infura.io/'),
      null,
      {
        transactionConfirmationBlocks: 1
      }
    )

    const rootChain = new RootChain(
      web3,
      '0x740ecec4c0ee99c285945de8b44e9f5bfb71eea7'
    )
    const childChain = new ChildChain('https://watcher.samrong.omg.network/')

    let childchainBalanceArray = await childChain.getBalance(
      '0x4522fb44C2aB359e76eCc75C22C9409690F12241'
    )
    console.log(childchainBalanceArray)

    const depositAmount = new BigNumber(web3.utils.toWei('0.01', 'ether'))
    console.log('Depositing...')

    const depositTransaction = transaction.encodeDeposit(
      '0x4522fb44C2aB359e76eCc75C22C9409690F12241',
      depositAmount,
      transaction.ETH_CURRENCY
    )

    console.log(
      `Depositing ${web3.utils.fromWei(
        depositAmount.toString(),
        'ether'
      )} ETH from the rootchain to the childchain`
    )
    console.log(`Awaiting rootChain.depositEth()...`)

    // deposit ETH into the Plasma contract
    const transactionReceipt = await rootChain.depositEth(
      depositTransaction,
      depositAmount,
      {
        from: '0x4522fb44C2aB359e76eCc75C22C9409690F12241',
        privateKey:
          '0xF06D1EE854EC1F7254627C5BB789611847FA90A6EFCECFD97B7B05443AFF2EE7',
        gasPrice: web3.utils.toWei('10', 'gwei')
      }
    )

    console.log(`Finished awaiting rootChain.depositEth()`)
    console.log(
      `Transaction receipt: ${JSON.stringify(transactionReceipt, undefined, 2)}`
    )

    // wait for transaction to be recorded by the watcher
    console.log(`Waiting for transaction to be recorded by the watcher...`)
    await waitForTransaction(web3, transactionReceipt.transactionHash, 4000, 12)

    const rootchainBalance = await web3.eth.getBalance(
      '0x4522fb44C2aB359e76eCc75C22C9409690F12241'
    )
    console.log(`Alice's new rootchain balance: ${rootchainBalance}`)

    childchainBalanceArray = await childChain.getBalance(
      '0x4522fb44C2aB359e76eCc75C22C9409690F12241'
    )
    console.log(
      `Alice's new childchain balance: ${
        childchainBalanceArray.length === 0
          ? 0
          : childchainBalanceArray[0].amount
      }`
    )

    return { test: '1234' }
  }

  return createAsyncAction({
    type: 'PLASMA/TEST',
    operation: asyncAction
  })
}

async function waitForTransaction(
  web3,
  transactionHash,
  millisToWaitForTxn,
  blocksToWaitForTxn
) {
  var transactionReceiptAsync = async (transactionHash, resolve, reject) => {
    try {
      let transactionReceipt = await web3.eth.getTransactionReceipt(
        transactionHash
      )

      if (blocksToWaitForTxn > 0) {
        try {
          let block = await web3.eth.getBlock(transactionReceipt.blockNumber)
          let current = await web3.eth.getBlock('latest')

          console.log(`transaction block: ${block.number}`)
          console.log(`current block:     ${current.number}`)

          if (current.number - block.number >= blocksToWaitForTxn) {
            let transaction = await web3.eth.getTransaction(transactionHash)

            if (transaction.blockNumber !== null) {
              return resolve(transactionReceipt)
            } else {
              return reject(
                new Error(
                  'Transaction with hash: ' +
                    transactionHash +
                    ' ended up in an uncle block.'
                )
              )
            }
          } else {
            setTimeout(
              () => transactionReceiptAsync(transactionHash, resolve, reject),
              millisToWaitForTxn
            )
          }
        } catch (e) {
          setTimeout(
            () => transactionReceiptAsync(transactionHash, resolve, reject),
            millisToWaitForTxn
          )
        }
      } else {
        return resolve(transactionReceipt)
      }
    } catch (e) {
      return reject(e)
    }
  }

  return new Promise((resolve, reject) =>
    transactionReceiptAsync(transactionHash, resolve, reject)
  )
}
