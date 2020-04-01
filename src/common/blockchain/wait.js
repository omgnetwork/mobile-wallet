import { Polling, OmgUtil } from 'common/utils'
import { web3 } from 'common/clients'
import { Plasma } from 'common/blockchain'

export const waitFor = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const waitChildChainBlknum = (address, blknum, interval) => {
  return Polling.pollUntilSuccess(async () => {
    const utxos = await Plasma.getUtxos(address)
    const found = utxos.find(utxo => utxo.blknum === blknum)
    if (found) {
      return {
        success: true,
        data: found
      }
    }

    return { success: false }
  }, interval)
}

export const waitForRootchainTransaction = ({
  hash,
  intervalMs,
  confirmationThreshold,
  onCountdown = remaining => {}
}) => {
  return OmgUtil.waitForRootchainTransaction({
    web3,
    transactionHash: hash,
    checkIntervalMs: intervalMs,
    blocksToWait: confirmationThreshold,
    onCountdown: onCountdown
  })
}
