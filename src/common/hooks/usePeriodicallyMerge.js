import { useCallback, useState, useEffect } from 'react'
import { Plasma } from 'common/blockchain'
import { useInterval } from 'common/hooks'
import { TransactionActionTypes } from 'common/constants'

const DEFAULT_INTERVAL = 10000 // 10s

const usePeriodicallyMerge = (
  dispatchMergeUtxosStatus,
  dispatchMergeUtxos,
  lastBlknum,
  interval = DEFAULT_INTERVAL
) => {
  const [blockchainWallet, setBlockchainWallet] = useState(null)
  const [busy, setBusy] = useState(true)
  const [unconfirmedTx, setUnconfirmedTx] = useState(false)
  const [merging, setMerging] = useState(false)

  const updateMergeStatus = useCallback(
    (blknum, utxos) => {
      if (blockchainWallet) {
        console.log(blknum)
        console.log('Remaining utxos', utxos.length)
        dispatchMergeUtxosStatus(address, blknum)
        const { address } = blockchainWallet
      }
    },
    [blockchainWallet, dispatchMergeUtxosStatus]
  )

  useEffect(() => {
    if (!unconfirmedTx) {
      setMerging(false)
    }
  }, [unconfirmedTx])

  useInterval(() => {
    async function checkAndMerge() {
      const { address, privateKey } = blockchainWallet
      const listOfUtxos = await Plasma.getRequiredMergeUtxos(address)

      if (listOfUtxos.length > 0 || (!!lastBlknum && !merging)) {
        dispatchMergeUtxos(
          address,
          privateKey,
          listOfUtxos,
          lastBlknum,
          updateMergeStatus
        )
        setMerging(true)
      }
    }

    console.log(lastBlknum)
    console.log('busy', busy)

    const pendingTx = unconfirmedTx
    const continueFromLastMerging = !!lastBlknum

    if (!busy && !merging) {
      if (continueFromLastMerging || !pendingTx) {
        checkAndMerge()
      }
    }
  }, interval)

  return [setBusy, setBlockchainWallet, setUnconfirmedTx]
}

export default usePeriodicallyMerge
