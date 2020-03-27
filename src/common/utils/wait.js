import { Polling } from 'common/utils'
import { Plasma } from 'common/blockchain'

export const waitFor = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const waitChildChainBlknum = (address, blknum) => {
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
  }, 3000)
}
