import { Polling } from 'common/utils'
import { web3 } from 'common/clients'
import { OmgUtil, Plasma, Utxos } from 'common/blockchain'

export const waitFor = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const waitChildChainBlknum = (address, blknum, interval) => {
  return Polling.pollUntilSuccess(async () => {
    const utxos = await Utxos.get(address)
    const target = utxos.find(utxo => utxo.blknum === blknum)
    if (target) {
      return {
        success: true,
        data: target
      }
    }

    return { success: false }
  }, interval)
}

export const waitForChildChainUtxoAmount = (
  desiredAmount,
  fromUtxoPos,
  blockchainWallet,
  token,
  interval = 3000
) => {
  let utxoPos = fromUtxoPos
  return Polling.pollUntilSuccess(async () => {
    const utxos = await Utxos.get(blockchainWallet.address, {
      fromUtxoPos: utxoPos + 1,
      currency: token.contractAddress
    })
    const hasNewUtxos = utxos.length > 0
    const desiredAmountUtxo = utxos.find(utxo => utxo.amount === desiredAmount)

    if (hasNewUtxos && desiredAmountUtxo) {
      return {
        success: true,
        data: desiredAmountUtxo
      }
    } else if (hasNewUtxos) {
      await Plasma.transfer(blockchainWallet, blockchainWallet.address, token)
      utxoPos = utxos[0].utxo_pos
    }
    return {
      success: false
    }
  }, interval)
}

export const waitForRootchainTransaction = ({
  hash,
  intervalMs,
  confirmationThreshold,
  onCountdown = () => {}
}) => {
  return OmgUtil.waitForRootchainTransaction({
    web3,
    transactionHash: hash,
    checkIntervalMs: intervalMs,
    blocksToWait: confirmationThreshold,
    onCountdown: onCountdown
  })
}

export const waitForBlockConfirmation = ({
  hash,
  intervalMs,
  blocksToWait,
  onCountdown
}) => {
  let cancelled = false
  let timeoutId

  const cancel = () => {
    cancelled = true
    clearTimeout(timeoutId)
    return Promise.reject('cancelled')
  }

  const waitUntilRemainingZero = async (resolve, reject) => {
    if (cancelled) {
      return reject('cancelled')
    }

    try {
      const receipt = await web3.eth.getTransactionReceipt(hash)
      const block = await web3.eth.getBlock(receipt.blockNumber)
      const latestBlock = await web3.eth.getBlock('latest')
      const remaining = blocksToWait - (latestBlock.number - block.number)
      onCountdown(remaining)
      if (remaining <= 0) {
        const transaction = await web3.eth.getTransaction(hash)
        if (transaction.blockNumber !== null) {
          resolve(receipt)
        } else {
          reject(
            new Error(
              'Transaction with hash: ' + hash + ' ended up in an uncle block.'
            )
          )
        }
      } else {
        timeoutId = setTimeout(
          () => waitUntilRemainingZero(resolve, reject),
          intervalMs
        )
      }
    } catch (err) {
      timeoutId = setTimeout(
        () => waitUntilRemainingZero(resolve, reject),
        intervalMs
      )
    }
  }

  return { waitForReceipt: new Promise(waitUntilRemainingZero), cancel }
}
