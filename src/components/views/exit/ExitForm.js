import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useLoading } from 'common/hooks'
import { plasmaActions } from 'common/actions'
import { GoogleAnalytics } from 'common/analytics'
import {
  OMGText,
  OMGExitWarning,
  OMGButton,
  OMGEditItem,
  OMGExitFee
} from 'components/widgets'
import {
  Plasma,
  GasEstimator,
  Utxos,
  BlockchainFormatter
} from 'common/blockchain'
import { ScrollView } from 'react-native-gesture-handler'

const ExitForm = ({
  theme,
  navigation,
  blockchainWallet,
  dispatchExit,
  unconfirmedTx,
  loading
}) => {
  const utxos = navigation.getParam('utxos')
  const token = navigation.getParam('token')
  const fee = navigation.getParam('fee')
  const exitAmount = BlockchainFormatter.formatUnits(
    Utxos.sum(utxos).toString(10),
    token.tokenDecimal
  )
  const [exitBond, setExitBond] = useState(null)
  const [gasUsed, setGasUsed] = useState(null)
  const [submitting] = useLoading(loading, 'CHILDCHAIN_EXIT')

  useEffect(() => {
    async function getStandardExitBond() {
      const bond = await Plasma.getStandardExitBond()
      setExitBond(bond)
    }

    async function getEstimateExitFee() {
      const estimatedFee = await GasEstimator.estimateExit(
        blockchainWallet,
        utxos
      )
      console.log(estimatedFee)
      setGasUsed(estimatedFee)
    }

    getStandardExitBond()
    getEstimateExitFee()
  }, [blockchainWallet, utxos])

  useEffect(() => {
    if (loading.success && loading.action === 'CHILDCHAIN_EXIT') {
      GoogleAnalytics.sendEvent('transfer_exited', { hash: unconfirmedTx.hash })
      navigation.navigate('Balance')
    }
  })

  const navigateEditAmount = useCallback(() => {
    navigation.navigate('ExitSelectBalance')
  }, [navigation])

  const navigateEditFee = useCallback(() => {
    navigation.navigate('ExitSelectFee')
  }, [navigation])

  const submit = useCallback(() => {
    dispatchExit(
      blockchainWallet,
      { ...token, balance: exitAmount },
      utxos,
      fee.amount
    )
  }, [blockchainWallet, dispatchExit, exitAmount, fee.amount, token, utxos])

  return (
    <ScrollView style={styles.container(theme)}>
      <View style={styles.contentContainer(theme)}>
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          Review Exit Detail
        </OMGText>
        <OMGEditItem
          title='Amount'
          value={exitAmount}
          onPress={navigateEditAmount}
          symbol={token.tokenSymbol}
          price={token.price}
          style={[styles.marginMedium, styles.paddingMedium]}
        />
        <OMGExitFee
          gasUsed={gasUsed}
          onPressEdit={navigateEditFee}
          gasPrice={fee.amount}
          exitBondValue={exitBond}
          style={[styles.marginSmall]}
        />
        <OMGExitWarning style={styles.marginMedium} />
        <View style={[styles.buttonContainer, styles.marginHigh]}>
          <OMGButton onPress={submit} loading={submitting}>
            Confirm Exit
          </OMGButton>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5
  }),
  contentContainer: theme => ({
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.black5
  }),
  title: theme => ({
    fontSize: 16,
    color: theme.colors.white,
    textTransform: 'uppercase'
  }),
  marginHigh: {
    marginTop: 30
  },
  marginMedium: {
    marginTop: 16
  },
  marginSmall: {
    marginTop: 10
  },
  paddingMedium: {
    padding: 12
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  blockchainWallet: state.setting.blockchainWallet,
  unconfirmedTx: state.transaction.unconfirmedTxs.slice(-1).pop()
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchExit: (blockchainWallet, token, utxos, gasPrice) =>
    dispatch(plasmaActions.exit(blockchainWallet, token, utxos, gasPrice))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(ExitForm)))
