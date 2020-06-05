import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useLoading } from 'common/hooks'
import { plasmaActions } from 'common/actions'
import { EventReporter } from 'common/reporter'
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
import { Styles, Formatter } from 'common/utils'

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
  const formattedAmount = BlockchainFormatter.formatUnits(
    Utxos.sum(utxos).toString(10),
    token.tokenDecimal
  )
  const exitAmount = Formatter.format(formattedAmount, {
    maxDecimal: token.tokenDecimal
  })
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
      setGasUsed(estimatedFee)
    }

    getStandardExitBond()
    getEstimateExitFee()
  }, [blockchainWallet, utxos])

  useEffect(() => {
    if (loading.success && loading.action === 'CHILDCHAIN_EXIT') {
      EventReporter.send('transfer_exited', { hash: unconfirmedTx.hash })
      navigation.navigate('Balance')
    }
  })

  const navigateEditAmount = () => {
    navigation.navigate('ExitSelectBalance')
  }
  const navigateEditFee = () => {
    navigation.navigate('ExitSelectFee')
  }

  const submit = () => {
    dispatchExit(
      blockchainWallet,
      { ...token, balance: exitAmount },
      utxos,
      fee.amount
    )
  }

  return (
    <View style={styles.container(theme)}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <OMGText
          style={[styles.title(theme), styles.marginMedium]}
          weight='regular'>
          Review Withdrawal Details
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
        <View style={styles.buttonContainer}>
          <OMGButton onPress={submit} loading={submitting}>
            Confirm Withdrawal
          </OMGButton>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  title: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    color: theme.colors.white,
    textTransform: 'uppercase'
  }),
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
    paddingTop: 16,
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
