import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Plasma } from 'common/blockchain'
import { plasmaActions } from 'common/actions'
import { notificationService } from 'common/services'
import BackgroundTimer from 'react-native-background-timer'

const TransactionTracker = ({
  wallet,
  pendingTxs,
  primaryWalletAddress,
  dispatchInvalidatePendingTx
}) => {
  const getTxsCallback = useCallback(async () => {
    console.log('execute')
    const pendingTxsHash = pendingTxs.map(pendingTx => pendingTx.hash)
    const result = await Plasma.getTxs(primaryWalletAddress, 0, 10)
    const currentWatcherTxs = result.map(tx => ({
      hash: tx.txhash
    }))

    console.log(currentWatcherTxs)

    const resolvedPendingTx = currentWatcherTxs.find(
      tx => pendingTxsHash.indexOf(tx.hash) > -1
    )

    console.log('have found yet?', resolvedPendingTx !== undefined)
    resolvedPendingTx !== undefined && console.log(resolvedPendingTx)
    if (resolvedPendingTx) {
      const pendingTx = pendingTxs.find(
        tx => tx.hash === resolvedPendingTx.hash
      )

      console.log('which one?', pendingTx)
      if (pendingTx) {
        let msg
        if (pendingTx.type === 'CHILDCHAIN_DEPOSIT') {
          msg = 'deposited'
        } else if (pendingTx.type === 'CHILDCHAIN_EXIT') {
          msg = 'exit is now taking off!'
        } else if (pendingTx.type === 'CHILDCHAIN_SEND_TOKEN') {
          msg = 'sent'
        }
        notificationService.sendNotification({
          title: `${wallet.name} ${msg}`,
          message: `${pendingTx.value} ${pendingTx.symbol}`
        })
        console.log('send notification')
        dispatchInvalidatePendingTx(primaryWalletAddress, pendingTx)
      }
    }
  }, [
    dispatchInvalidatePendingTx,
    pendingTxs,
    primaryWalletAddress,
    wallet.name
  ])

  useEffect(() => {
    if (pendingTxs && pendingTxs.length) {
      BackgroundTimer.stopBackgroundTimer()
      BackgroundTimer.runBackgroundTimer(() => {
        const hasChildchainTx = pendingTxs.find(
          pendingTx => pendingTx.type.indexOf('CHILDCHAIN') > -1
        )
        if (hasChildchainTx) {
          getTxsCallback()
        } else {
          BackgroundTimer.stopBackgroundTimer()
        }
      }, 5000)
    } else {
      BackgroundTimer.stopBackgroundTimer()
    }
    return () => {
      console.log('stop timer')
      BackgroundTimer.stopBackgroundTimer()
    }
  }, [getTxsCallback, pendingTxs])

  return null
}

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  pendingTxs: state.transaction.pendingTxs,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchInvalidatePendingTx: (address, resolvedPendingTx) =>
    dispatch(
      plasmaActions.invalidatePendingTx([], address, [resolvedPendingTx])
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionTracker)
