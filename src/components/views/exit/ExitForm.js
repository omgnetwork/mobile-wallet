import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, InteractionManager } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import {
  OMGText,
  OMGTokenInput,
  OMGAmountInput,
  OMGExitWarning,
  OMGButton,
  OMGExitFee
} from 'components/widgets'
import { TransferHelper } from 'components/views/transfer'
import { Validator, GasEstimator } from 'common/utils'
import { Plasma } from 'common/blockchain'
import { OMGBlockchainLabel } from 'components/widgets'
import { ScrollView } from 'react-native-gesture-handler'

const ExitForm = ({
  wallet,
  theme,
  navigation,
  isFocused,
  blockchainWallet
}) => {
  const amount = navigation.getParam('amount')
  const selectedToken = navigation.getParam(
    'selectedToken',
    wallet.childchainAssets[0]
  )
  const amountRef = useRef(amount)
  const amountFocusRef = useRef(null)
  const [exitBond, setExitBond] = useState(null)
  const [exitToken, setExitToken] = useState(null)
  const [exitFee, setExitFee] = useState(null)
  const [showErrorAmount, setShowErrorAmount] = useState(false)
  const [errorAmountMessage, setErrorAmountMessage] = useState('Invalid amount')

  const focusOn = useCallback(inputRef => {
    InteractionManager.runAfterInteractions(() => {
      inputRef.current.focus()
    })
  }, [])

  useEffect(() => {
    async function getStandardExitBond() {
      const bond = await Plasma.getStandardExitBond()
      setExitBond(bond)
    }

    async function getEstimateExitFee() {
      const fee = await GasEstimator.estimateExit(blockchainWallet, exitToken)
      setExitFee(fee)
    }

    if (isFocused) {
      focusOn(amountFocusRef)
      getStandardExitBond()
      if (exitToken) {
        getEstimateExitFee()
      }
    }
  }, [blockchainWallet, exitToken, focusOn, isFocused])

  useEffect(() => {
    setExitToken({ ...selectedToken, balance: 1 })
  }, [selectedToken])

  const navigateNext = useCallback(() => {
    if (!Validator.isValidAmount(amountRef.current)) {
      setErrorAmountMessage('Invalid amount')
      setShowErrorAmount(true)
    } else if (
      !Validator.isEnoughToken(amountRef.current, selectedToken.balance)
    ) {
      setErrorAmountMessage('Not enough balance')
      setShowErrorAmount(true)
    } else {
      setShowErrorAmount(false)
      navigation.navigate('ExitConfirm', {
        token: { ...selectedToken, balance: amountRef.current }
      })
    }
  }, [navigation, selectedToken])

  return (
    <ScrollView style={styles.container(theme)}>
      <OMGBlockchainLabel
        actionText='Exit to'
        transferType={TransferHelper.TYPE_EXIT}
      />
      <View style={styles.contentContainer(theme)}>
        <OMGText style={[styles.title(theme), styles.marginHigh]}>
          Token
        </OMGText>
        <OMGTokenInput
          token={selectedToken}
          style={styles.marginSmall}
          onPress={() =>
            navigation.navigate('TransferSelectBalance', {
              transferType: TransferHelper.TYPE_EXIT,
              currentToken: selectedToken,
              amount: amountRef.current,
              assets: wallet.childchainAssets,
              exit: true
            })
          }
        />
        <OMGText style={[styles.title(theme), styles.marginHigh]}>
          Amount
        </OMGText>
        <OMGAmountInput
          token={selectedToken}
          inputRef={amountRef}
          focusRef={amountFocusRef}
          showError={showErrorAmount}
          errorMessage={errorAmountMessage}
          defaultValue={amount}
          style={styles.marginSmall}
        />
        <OMGText style={[styles.title(theme), styles.marginHigh]}>
          Exit Fee
        </OMGText>
        <OMGExitFee
          feeValue={exitFee}
          exitBondValue={exitBond}
          style={styles.marginSmall}
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
    fontSize: 12,
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
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  blockchainWallet: state.setting.blockchainWallet
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(ExitForm)))
