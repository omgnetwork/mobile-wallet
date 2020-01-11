import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import {
  OMGText,
  OMGTokenInput,
  OMGAmountInput,
  OMGExitWarning,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'
import { Validator } from 'common/utils'
import { withNavigation } from 'react-navigation'
import { OMGBlockchainLabel } from 'components/widgets'

const ExitForm = ({ wallet, theme, navigation }) => {
  const defaultAmount = navigation.getParam('lastAmount')
  const selectedToken = navigation.getParam(
    'selectedToken',
    wallet.childchainAssets[0]
  )
  const amountRef = useRef(defaultAmount)
  const amountFocusRef = useRef(null)
  const [showErrorAmount, setShowErrorAmount] = useState(false)
  const [errorAmountMessage, setErrorAmountMessage] = useState('Invalid amount')

  useEffect(() => {
    if (!amountFocusRef.current) return
    if (wallet.childchainAssets.length === 1) {
      amountFocusRef.current.focus()
    }
  }, [wallet.childchainAssets.length])

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
    <OMGDismissKeyboard style={styles.container}>
      <OMGBlockchainLabel actionText='Sending to' isRootchain={true} />
      <View style={styles.contentContainer}>
        <OMGText weight='bold' style={styles.title(theme)}>
          Select Exit Amount
        </OMGText>
        <OMGTokenInput
          token={selectedToken}
          style={styles.tokenInput}
          onPress={() =>
            navigation.navigate('TransferSelectBalance', {
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
        <OMGExitWarning style={styles.textWarning} />
        <View style={styles.buttonContainer}>
          <OMGButton onPress={navigateNext}>Next</OMGButton>
        </View>
      </View>
    </OMGDismissKeyboard>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  textWarning: {
    marginTop: 16,
    marginHorizontal: -16
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
)(withNavigation(withTheme(ExitForm)))
