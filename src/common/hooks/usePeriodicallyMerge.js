import { useCallback, useState, useEffect, useRef } from 'react'
import { Vibration } from 'react-native'
import { Plasma } from 'common/blockchain'
import { useInterval } from 'common/hooks'

const DEFAULT_INTERVAL = 15000 // 15s
const MERGE_UTXOS_LOADING_ACTION = 'CHILDCHAIN_MERGE_UTXOS'

const usePeriodicallyMerge = (
  dispatchUpdateMergeUtxosStatus,
  dispatchMergeUtxos,
  lastBlknum,
  interval = DEFAULT_INTERVAL
) => {
  const [blockchainWallet, setBlockchainWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unconfirmedTx, setUnconfirmedTx] = useState(false)
  const [merging, setMerging] = useRef(false)

  const updateMergeStatus = useCallback(
    (blknum, utxos) => {
      if (blockchainWallet) {
        dispatchUpdateMergeUtxosStatus(address, blknum)
        const { address } = blockchainWallet
      }
    },
    [blockchainWallet, dispatchUpdateMergeUtxosStatus]
  )

  useEffect(() => {
    if (loading.action === MERGE_UTXOS_LOADING_ACTION) {
      setMerging(loading.show)
    }
  }, [loading, setMerging])

  // Vibrate after the merging is done
  useEffect(() => {
    if (loading.action === MERGE_UTXOS_LOADING_ACTION && loading.success) {
      Vibration.vibrate()
    }
  })

  useInterval(() => {
    const pendingTx = unconfirmedTx
    const unconfirmedBlknum = !!lastBlknum

    async function checkAndMerge() {
      const { address, privateKey } = blockchainWallet
      const listOfUtxos = await Plasma.getRequiredMergeUtxos(address)

      if (unconfirmedBlknum || listOfUtxos.length > 0) {
        dispatchMergeUtxos(
          address,
          privateKey,
          listOfUtxos,
          lastBlknum,
          updateMergeStatus
        )
      }
    }

    if (!blockchainWallet) return
    if (merging) return
    if (pendingTx) return
    checkAndMerge()
  }, interval)

  return [setLoading, setBlockchainWallet, setUnconfirmedTx]
}

export default usePeriodicallyMerge
