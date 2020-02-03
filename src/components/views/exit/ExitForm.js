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
  OMGDismissKeyboard
} from 'components/widgets'
import { TransferHelper } from 'components/views/transfer'
import { Validator } from 'common/utils'
import { OMGBlockchainLabel } from 'components/widgets'
import { ScrollView } from 'react-native-gesture-handler'

const ExitForm = ({ wallet, theme, navigation, isFocused }) => {
  const defaultAmount = navigation.getParam('lastAmount')
  const selectedToken = navigation.getParam(
    'selectedToken',
    wallet.childchainAssets[0]
  )
  const amountRef = useRef(defaultAmount)
  const amountFocusRef = useRef(null)
  const [showErrorAmount, setShowErrorAmount] = useState(false)
  const [errorAmountMessage, setErrorAmountMessage] = useState('Invalid amount')

  const focusOn = useCallback(inputRef => {
    InteractionManager.runAfterInteractions(() => {
      inputRef.current.focus()
    })
  }, [])

  useEffect(() => {
    if (isFocused) {
      focusOn(amountFocusRef)
    }
  }, [focusOn, isFocused])

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
    <OMGDismissKeyboard style={styles.container(theme)}>
      <OMGBlockchainLabel
        actionText='Exit to'
        transferType={TransferHelper.TYPE_EXIT}
      />
      <View style={styles.contentContainer(theme)}>
        <ScrollView>
          <OMGText weight='mono-semi-bold' style={styles.title(theme)}>
            Select Exit Amount
          </OMGText>
          <OMGTokenInput
            token={selectedToken}
            style={styles.tokenInput}
            onPress={() =>
              navigation.navigate('TransferSelectBalance', {
                transferType: TransferHelper.TYPE_EXIT,
                currentToken: selectedToken,
                lastAmount: amountRef.current,
                assets: wallet.childchainAssets,
                exit: true
              })
            }
          />
          <OMGAmountInput
            token={selectedToken}
            inputRef={amountRef}
            focusRef={amountFocusRef}
            showError={showErrorAmount}
            errorMessage={errorAmountMessage}
            defaultValue={navigation.getParam('lastAmount')}
            style={styles.amountInput}
          />
          <OMGExitWarning style={styles.warningContainer} />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <OMGButton onPress={navigateNext}>Next</OMGButton>
        </View>
      </View>
    </OMGDismissKeyboard>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.gray4
  }),
  keyboardAvoidingView: {},
  contentContainer: theme => ({
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.gray4
  }),
  warningContainer: {
    marginTop: 16
  },
  title: theme => ({
    color: theme.colors.gray3,
    marginTop: 16
  }),
  tokenInput: {
    marginTop: 16
  },
  amountInput: {
    marginTop: 16
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(ExitForm)))
