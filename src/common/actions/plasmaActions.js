import { createAsyncAction } from './actionCreators'
import { plasmaService, walletService } from 'common/services'
export const depositEth = (wallet, provider, token, fee) => {
  const asyncAction = async () => {
    const blockchainWallet = await walletService.get(wallet.address, provider)

    const transactionReceipt = await plasmaService.depositEth(
      blockchainWallet.address,
      blockchainWallet.privateKey,
      token.balance,
      fee
    )

    return { address: wallet.address, transactionReceipt }
  }
  return createAsyncAction({
    type: 'PLASMA/DEPOSIT_ETH_TOKEN',
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
