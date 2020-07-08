import { useCallback, useState, useEffect } from 'react'
import { Vibration } from 'react-native'
import { Utxos } from 'common/blockchain'
import { useInterval } from 'common/hooks'
import { TransactionActionTypes } from 'common/constants'

const DEFAULT_INTERVAL = 15000 // 15s
const MERGE_UTXOS_LOADING_ACTION = 'CHILDCHAIN_MERGE_UTXOS'

const useMergeInterval = (
  dispatchUpdateMergeUtxosStatus,
  dispatchMergeUtxos,
  maximumUtxosPerCurrency,
  interval = DEFAULT_INTERVAL
) => {
  const [blockchainWallet, setBlockchainWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unconfirmedTx, setUnconfirmedTx] = useState(false)

  const updateBlknum = useCallback(
    blknum => {
      if (blockchainWallet) {
        const { address } = blockchainWallet
        dispatchUpdateMergeUtxosStatus(address, blknum)
      }
    },
    [blockchainWallet, dispatchUpdateMergeUtxosStatus]
  )

  const merge = useCallback(
    ({ address, privateKey }, listOfRequiredMergeUtxos) => {
      if (listOfRequiredMergeUtxos.length > 0) {
        dispatchMergeUtxos(
          address,
          privateKey,
          maximumUtxosPerCurrency,
          listOfRequiredMergeUtxos,
          updateBlknum
        )
      }
    },
    [blockchainWallet, dispatchMergeUtxos, unconfirmedTx, updateBlknum]
  )

  // Vibrate after the merging is done
  useEffect(() => {
    if (loading.action === MERGE_UTXOS_LOADING_ACTION) {
      if (loading.success) {
        Vibration.vibrate()
      }
    }
  }, [loading])

  // If there's no pending transaction, check for the utxos to merge periodically.
  useInterval(() => {
    async function mergeIfRequired({ address, privateKey }, blknum) {
      const utxos = await Utxos.get(address)
      const hasBlknumInWatcher = utxos.some(utxo => utxo.blknum === blknum)

      if (blknum && !hasBlknumInWatcher) return

      const utxosMap = Utxos.mapByCurrency(utxos)
      const listOfRequiredMergeUtxos = Utxos.filterOnlyGreaterThanMaximum(
        utxosMap,
        maximumUtxosPerCurrency
      )

      if (listOfRequiredMergeUtxos.length > 0) {
        merge({ address, privateKey }, listOfRequiredMergeUtxos)
      }
    }

    // Return if the blockchain wallet has not been loaded
    if (!blockchainWallet) return

    if (!unconfirmedTx) {
      return mergeIfRequired(blockchainWallet, null)
    }

    if (
      unconfirmedTx.actionType ===
      TransactionActionTypes.TYPE_CHILDCHAIN_MERGE_UTXOS
    ) {
      mergeIfRequired(blockchainWallet, unconfirmedTx?.blknum)
    }
  }, interval)

  return [setLoading, setBlockchainWallet, setUnconfirmedTx]
}

export default useMergeInterval
