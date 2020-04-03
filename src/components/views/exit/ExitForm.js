import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useLoading } from 'common/hooks'
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

const ExitForm = ({ theme, navigation, blockchainWallet }) => {
  const utxos = navigation.getParam('utxos')
  const token = navigation.getParam('token')
  const fee = navigation.getParam('fee')
  const exitAmount = BlockchainFormatter.formatUnits(
    Utxos.sum(utxos).toString(10),
    token.tokenDecimal
  )
  const [exitBond, setExitBond] = useState(null)
  const [gasUsed, setGasUsed] = useState(null)

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

  const navigateNext = useCallback(() => {
    navigation.navigate('ExitConfirm', {
      token: { ...token, balance: exitAmount },
      gasUsed: gasUsed,
      gasPrice: fee.amount,
      exitBond
    })
  }, [exitAmount, exitBond, fee.amount, gasUsed, navigation, token])

  return (
    <ScrollView style={styles.container(theme)}>
      <View style={styles.contentContainer(theme)}>
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          Review Exit Detail
        </OMGText>
        <OMGEditItem
          title='Amount'
          value={exitAmount}
          symbol={token.tokenSymbol}
          price={token.price}
          style={[styles.marginMedium, styles.paddingMedium]}
        />
        <OMGExitFee
          gasUsed={gasUsed}
          gasPrice={fee.amount}
          exitBondValue={exitBond}
          style={[styles.marginSmall]}
        />
        <OMGExitWarning style={styles.marginMedium} />
        <View style={[styles.buttonContainer, styles.marginHigh]}>
          <OMGButton onPress={navigateNext}>Next</OMGButton>
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
  blockchainWallet: state.setting.blockchainWallet
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(ExitForm)))
