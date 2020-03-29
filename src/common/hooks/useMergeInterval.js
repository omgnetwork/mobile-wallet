import { useCallback, useState, useEffect, useRef } from 'react'
import { Vibration } from 'react-native'
import { Plasma } from 'common/blockchain'
import { useInterval } from 'common/hooks'
import { TransactionActionTypes } from 'common/constants'

const DEFAULT_INTERVAL = 15000 // 15s
const MERGE_UTXOS_LOADING_ACTION = 'CHILDCHAIN_MERGE_UTXOS'

const useMergeInterval = (
  dispatchUpdateMergeUtxosStatus,
  dispatchMergeUtxos,
  interval = DEFAULT_INTERVAL
) => {
  const [blockchainWallet, setBlockchainWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unconfirmedTx, setUnconfirmedTx] = useState(false)
  const running = useRef(false)

  const updateMergeStatus = useCallback(
    (blknum, utxos) => {
      if (blockchainWallet) {
        dispatchUpdateMergeUtxosStatus(address, blknum)
        const { address } = blockchainWallet
      }
    },
    [blockchainWallet, dispatchUpdateMergeUtxosStatus]
  )

  const checkAndMerge = useCallback(async () => {
    const { address, privateKey } = blockchainWallet
    const unsubmittedBlknum = unconfirmedTx?.blknum
    const listOfUtxos = await Plasma.getRequiredMergeUtxos(
      address,
      unsubmittedBlknum
    )

    if (listOfUtxos.length > 0) {
      dispatchMergeUtxos(address, privateKey, listOfUtxos, updateMergeStatus)
    }
  }, [blockchainWallet, dispatchMergeUtxos, unconfirmedTx, updateMergeStatus])

  // Vibrate after the merging is done
  useEffect(() => {
    if (loading.action === MERGE_UTXOS_LOADING_ACTION) {
      if (loading.success) {
        Vibration.vibrate()
      }
      running.current = loading.show
    }
  }, [loading])

  // If there's no pending transaction, check for the utxos to merge periodically.
  useInterval(() => {
    // Return if the blockchain wallet has not been loaded
    if (!blockchainWallet) return

    // Return if it's still running.
    if (running.current) return

    if (!unconfirmedTx) {
      return checkAndMerge()
    }

    if (
      unconfirmedTx.actionType ===
      TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
    ) {
      return checkAndMerge()
    }
  }, interval)

  return [setLoading, setBlockchainWallet, setUnconfirmedTx]
}

export default useMergeInterval
