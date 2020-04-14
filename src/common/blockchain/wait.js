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
