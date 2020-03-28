import { useCallback, useState, useEffect, useRef } from 'react'
import { Plasma } from 'common/blockchain'
import { useInterval } from 'common/hooks'

const DEFAULT_INTERVAL = 10000 // 10s

const usePeriodicallyMerge = (
  dispatchMergeUtxosStatus,
  dispatchMergeUtxos,
  lastBlknum,
  interval = DEFAULT_INTERVAL
) => {
  const [blockchainWallet, setBlockchainWallet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unconfirmedTx, setUnconfirmedTx] = useState(false)
  const merging = useRef(false)

  const updateMergeStatus = useCallback(
    (blknum, utxos) => {
      if (blockchainWallet) {
        dispatchMergeUtxosStatus(address, blknum)
        const { address } = blockchainWallet
      }
    },
    [blockchainWallet, dispatchMergeUtxosStatus]
  )

  useEffect(() => {
    if (loading.action === 'CHILDCHAIN_MERGE_UTXOS_IF_NEEDED') {
      merging.current === loading.show
    }
  }, [loading])

  useInterval(() => {
    async function checkAndMerge() {
      const { address, privateKey } = blockchainWallet
      const listOfUtxos = await Plasma.getRequiredMergeUtxos(address)

      if (listOfUtxos.length > 0 || (!!lastBlknum && !merging)) {
        console.log('dispatch merge utxos')
        dispatchMergeUtxos(
          address,
          privateKey,
          listOfUtxos,
          lastBlknum,
          updateMergeStatus
        )
      }
    }

    const pendingTx = unconfirmedTx
    const continueFromLastMerging = !!lastBlknum

    if (blockchainWallet && !merging.current) {
      if (continueFromLastMerging || !pendingTx) {
        checkAndMerge()
      }
    }
  }, interval)

  return [setLoading, setBlockchainWallet, setUnconfirmedTx]
}

export default usePeriodicallyMerge
