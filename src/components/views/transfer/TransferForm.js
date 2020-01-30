import React, { useRef, useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, InteractionManager } from 'react-native'
import { withNavigationFocus, SafeAreaView } from 'react-navigation'
import * as TransferHelper from './transferHelper'
import * as TransferNavigation from './transferNavigation'
import feeOptions from './feeOptions'
import { withTheme } from 'react-native-paper'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGAddressInput,
  OMGKeyboardShift,
  OMGTokenInput,
  OMGWalletAddress,
  OMGAmountInput,
  OMGFeeInput,
  OMGBlockchainLabel
} from 'components/widgets'
import { Validator } from 'common/utils'
import * as BlockchainLabel from './blockchainLabel'

const testAddress = '0xf1deFf59DA938E31673DA1300b479896C743d968'

const TransferForm = ({ wallet, theme, navigation, isFocused }) => {
  const selectedFee = navigation.getParam('selectedFee', feeOptions[0])
  const selectedAddress = navigation.getParam('address') || testAddress
  const defaultAmount = navigation.getParam('lastAmount')
  const transferType = navigation.getParam('transferType')
  const selectedToken = navigation.getParam(
    'selectedToken',
    TransferHelper.getDefaultToken(
      transferType,
      wallet.rootchainAssets,
      wallet.childchainAssets
    )
  )
  const hasAddressInput = transferType !== TransferHelper.TYPE_DEPOSIT
  const hasEmptyAddressInput = !selectedAddress
  const shouldFocusAddressInput = hasAddressInput && hasEmptyAddressInput
  const addressRef = useRef(selectedAddress)
  const amountRef = useRef(defaultAmount)
  const amountFocusRef = useRef(null)
  const addressFocusRef = useRef(null)
  const keyboardAwareScrollRef = useRef(null)
  const [showErrorAddress, setShowErrorAddress] = useState(false)
  const [showErrorAmount, setShowErrorAmount] = useState(false)
  const [errorAmountMessage, setErrorAmountMessage] = useState('Invalid amount')
  const blockchainLabelActionText = BlockchainLabel.getBlockchainTextActionLabel(
    'TransferForm',
    transferType
  )
  useEffect(() => {
    const shouldActiveKeyboard = navigation.getParam('shouldFocus')
    if (isFocused && shouldActiveKeyboard) {
      if (shouldFocusAddressInput) {
        focusOn(addressFocusRef)
      } else {
        setTimeout(() => {
          focusOn(amountFocusRef)
        }, 300)
      }
    }
  }, [
    focusOn,
    isFocused,
    navigation,
    selectedAddress,
    shouldFocusAddressInput,
    transferType
  ])

  const focusOn = useCallback(inputRef => {
    InteractionManager.runAfterInteractions(() => {
      inputRef.current.focus()
    })
  }, [])

  const blurOn = useCallback(inputRef => {
    inputRef.current.blur()
  }, [])

  const moveFocusFromAddressToAmount = useCallback(() => {
    blurOn(addressFocusRef)
    setTimeout(() => {
      focusOn(amountFocusRef)
    }, 250)
  }, [blurOn, focusOn])

  const navigateToSelectBalance = useCallback(() => {
    const { paramsForTransferFormToTransferSelectBalance } = TransferNavigation
    navigation.navigate(
      'TransferSelectBalance',
      paramsForTransferFormToTransferSelectBalance({
        selectedToken,
        currentAmount: amountRef.current,
        transferType
      })
    )
  }, [navigation, selectedToken, transferType])

  const submit = useCallback(() => {
    if (!Validator.isValidAddress(addressRef.current)) {
      setShowErrorAddress(true)
    } else if (!Validator.isValidAmount(amountRef.current)) {
      setErrorAmountMessage('Invalid amount')
      setShowErrorAmount(true)
    } else if (
      !Validator.isEnoughToken(amountRef.current, selectedToken.balance)
    ) {
      setErrorAmountMessage('Not enough balance')
      setShowErrorAmount(true)
    } else {
      setShowErrorAddress(false)
      setShowErrorAmount(false)
      const { paramsForTransferFormToTransferConfirm } = TransferNavigation
      navigation.navigate(
        'TransferConfirm',
        paramsForTransferFormToTransferConfirm({
          selectedToken,
          currentAmount: amountRef.current,
          currentAddress: addressRef.current,
          wallet,
          transferType,
          selectedFee
        })
      )
    }
  }, [navigation, selectedFee, selectedToken, transferType, wallet])

  const navigateToTransferScanner = useCallback(() => {
    const { paramsForTransferFormToTransferScanner } = TransferNavigation
    navigation.navigate(
      'TransferScanner',
      paramsForTransferFormToTransferScanner({
        isRootchain: transferType === TransferHelper.TYPE_TRANSFER_ROOTCHAIN
      })
    )
  }, [navigation, transferType])

  const navigationToTransferSelectFee = useCallback(() => {
    navigation.navigate('TransferSelectFee', {
      currentToken: {
        ...selectedToken,
        balance: amountRef.current
      },
      currentFee: selectedFee,
      fees: feeOptions
    })
  }, [navigation, selectedFee, selectedToken])

  const renderAddressElement = useCallback(() => {
    return transferType === TransferHelper.TYPE_DEPOSIT ? (
      <OMGWalletAddress
        style={styles.addressInput}
        name='Plasma Contract'
        address={selectedAddress}
      />
    ) : (
      <OMGAddressInput
        style={styles.addressInput}
        inputRef={addressRef}
        showError={showErrorAddress}
        focusRef={addressFocusRef}
        returnKeyType='next'
        onSubmitEditing={moveFocusFromAddressToAmount}
        onPressScanQR={navigateToTransferScanner}
      />
    )
  }, [
    moveFocusFromAddressToAmount,
    navigateToTransferScanner,
    selectedAddress,
    showErrorAddress,
    transferType
  ])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGKeyboardShift
        contentContainerStyle={styles.scrollView}
        innerRef={ref => {
          keyboardAwareScrollRef.current = ref
        }}>
        <View style={styles.formContainer(theme)}>
          <OMGBlockchainLabel
            actionText={blockchainLabelActionText}
            transferType={transferType}
          />
          <OMGBox style={styles.fromContainer(theme)}>
            <OMGText weight='mono-semi-bold' style={styles.title(theme)}>
              From
            </OMGText>
            <OMGTokenInput
              token={selectedToken}
              style={styles.tokenInput}
              onPress={navigateToSelectBalance}
            />
            <OMGWalletAddress
              name={wallet.name}
              address={wallet.address}
              style={styles.walletAddress}
            />
          </OMGBox>
          <OMGBox style={styles.toContainer(theme)}>
            <OMGText weight='mono-semi-bold' style={styles.title(theme)}>
              To
            </OMGText>
            {renderAddressElement()}
          </OMGBox>
          <OMGBox style={styles.amountContainer(theme)}>
            <OMGText weight='mono-semi-bold' style={styles.title(theme)}>
              Amount
            </OMGText>
            <OMGAmountInput
              token={selectedToken}
              inputRef={amountRef}
              showError={showErrorAmount}
              errorMessage={errorAmountMessage}
              focusRef={amountFocusRef}
              defaultValue={navigation.getParam('lastAmount')}
              style={styles.amountInput}
            />
          </OMGBox>
          <OMGBox
            style={styles.feeContainer(
              theme,
              transferType === TransferHelper.TYPE_TRANSFER_ROOTCHAIN
            )}>
            <OMGText weight='mono-semi-bold' style={styles.title(theme)}>
              Transaction Fee
            </OMGText>
            <OMGFeeInput
              fee={selectedFee}
              style={styles.feeInput}
              onPress={navigationToTransferSelectFee}
            />
          </OMGBox>
        </View>
        <View style={styles.buttonContainer}>
          <OMGButton onPress={submit}>Next</OMGButton>
        </View>
      </OMGKeyboardShift>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7
  }),
  scrollView: {
    flexGrow: 1
  },
  formContainer: theme => ({
    flex: 1,
    backgroundColor: theme.colors.new_black7
  }),
  dismissKeyboard: {
    flex: 1
  },
  fromContainer: theme => ({
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.new_black7
  }),
  toContainer: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7
  }),
  amountContainer: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7
  }),
  feeContainer: (theme, isRootchain) => ({
    display: isRootchain ? 'flex' : 'none',
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7
  }),
  tokenInput: {
    marginTop: 16
  },
  walletAddress: {
    marginTop: 16
  },
  addressInput: {
    marginTop: 16
  },
  amountInput: {
    marginTop: 16
  },
  feeInput: {
    marginTop: 16
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16
  },
  title: theme => ({
    color: theme.colors.white
  })
})

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(TransferForm)))
