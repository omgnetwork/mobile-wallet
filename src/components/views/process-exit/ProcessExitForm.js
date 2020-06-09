import React, { useCallback, useState, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import {
  OMGText,
  OMGBlockchainLabel,
  OMGUtxoDetail,
  OMGTokenID,
  OMGProcessExitText,
  OMGKeyboardShift,
  OMGButton
} from 'components/widgets'
import { plasmaActions } from 'common/actions'
import { Plasma } from 'common/blockchain'
import { StyleSheet, View } from 'react-native'

const ProcessExitForm = ({
  theme,
  navigation,
  blockchainWallet,
  dispatchProcessExit,
  unconfirmedTx,
  loading
}) => {
  const transaction = navigation.getParam('transaction')
  const [maxExits, setMaxExits] = useState(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const handleOnSubmit = useCallback(async () => {
    dispatchProcessExit(blockchainWallet, transaction, maxExits)
  }, [blockchainWallet, dispatchProcessExit, maxExits, transaction])

  useEffect(() => {
    if (loading.action === 'CHILDCHAIN_PROCESS_EXIT') {
      setBtnLoading(loading.show)
      if (loading.success) {
        navigation.navigate('ProcessExitPending', {
          transaction: unconfirmedTx
        })
      }
    }
  }, [
    loading.action,
    loading.show,
    loading.success,
    navigation,
    transaction,
    unconfirmedTx
  ])

  useEffect(() => {
    async function getExitQueue() {
      const exitQueue = await Plasma.getExitQueue(transaction.contractAddress)
      let position = exitQueue.queue.findIndex(
        q => q.exitId === transaction.exitId
      )
      setMaxExits(position + 1)
    }

    getExitQueue()
  }, [transaction])

  useEffect(() => {
    const hasPendingTransaction = !!unconfirmedTx
    setDisabled(hasPendingTransaction)
  }, [unconfirmedTx])

  return (
    <View style={styles.container(theme)}>
      <OMGBlockchainLabel
        actionText={'Sending on'}
        transferType={'Ethereum Rootchain'}
      />
      <OMGKeyboardShift
        extraHeight={70}
        contentContainerStyle={styles.contentContainer}
        androidEnabled={true}>
        <OMGText style={[styles.title(theme)]}>UTXO DETAILS</OMGText>
        <OMGUtxoDetail utxo={transaction} style={styles.marginSmall} />
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          TOKEN ID
        </OMGText>
        <OMGTokenID
          tokenContractAddress={transaction.contractAddress}
          style={styles.marginSmall}
        />
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          WITHDRAWALS TO PROCESS
        </OMGText>
        <OMGProcessExitText exitQueue={maxExits} style={styles.marginSmall} />

        <View style={styles.buttonContainer}>
          {disabled && (
            <OMGText style={styles.textWarning(theme)}>
              Please wait the pending transaction to be completed.
            </OMGText>
          )}
          <OMGButton
            loading={btnLoading}
            disabled={disabled}
            onPress={handleOnSubmit}>
            Process Withdrawal
          </OMGButton>
        </View>
      </OMGKeyboardShift>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
  }),
  marginSmall: {
    marginTop: 10
  },
  marginMedium: {
    marginTop: 20
  },
  title: theme => ({
    color: theme.colors.white,
    fontSize: 12
  }),
  contentContainer: {
    padding: 16,
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  textWarning: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    marginBottom: 12,
    color: theme.colors.gray6
  })
})

const mapStateToProps = (state, _ownProps) => {
  return {
    blockchainWallet: state.setting.blockchainWallet,
    loading: state.loading,
    unconfirmedTx: state.transaction.unconfirmedTxs.slice(-1)[0]
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchProcessExit: (blockchainWallet, utxo, maxExitsToProcess) => {
    dispatch(
      plasmaActions.processExits(blockchainWallet, utxo, maxExitsToProcess)
    )
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ProcessExitForm)))
