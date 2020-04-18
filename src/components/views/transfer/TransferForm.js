import React, { useRef, useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withNavigationFocus, SafeAreaView } from 'react-navigation'
import * as TransferHelper from './transferHelper'
import { withTheme } from 'react-native-paper'
import { plasmaActions, ethereumActions } from 'common/actions'
import { useLoading } from 'common/hooks'
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
  OMGBlockchainLabel,
  OMGFeeTokenInput
} from 'components/widgets'
import { Validator } from 'common/blockchain'
import * as BlockchainLabel from './blockchainLabel'
import {
  getParamsForTransferForm,
  paramsForTransferFormToTransferSelectBalance,
  paramsForTransferFormToTransferConfirm,
  paramsForTransferFormToTransferScanner,
  paramsForTransferFormToTransferSelectFee,
  paramsForTransferFormToTransferSelectPlasmaFee
} from './transferNavigation'
import { Styles } from 'common/utils'

// const testAddress = '0x358303D2Dcc6924F634E37b805b62b820bB1E1B5'

const TransferForm = ({
  wallet,
  theme,
  navigation,
  isFocused,
  dispatchGetFees,
  dispatchGetRecommendedGas,
  gasOptions,
  fees,
  loading
}) => {
  const {
    selectedEthFee,
    selectedPlasmaFee,
    selectedToken,
    amount,
    address,
    transferType
  } = getParamsForTransferForm(navigation, wallet)

  const blockchainLabelActionText = BlockchainLabel.getBlockchainTextActionLabel(
    'TransferForm',
    transferType
  )
  const addressRef = useRef(address)
  const amountRef = useRef(amount)
  const amountFocusRef = useRef(null)
  const keyboardAwareScrollRef = useRef(null)
  const [showErrorAddress, setShowErrorAddress] = useState(false)
  const [showErrorAmount, setShowErrorAmount] = useState(false)
  const [ethFee, setEthFee] = useState(selectedEthFee)
  const [loadingFeeToken] = useLoading(
    loading,
    'CHILDCHAIN_FEES',
    fees.length === 0
  )
  const [loadingGas] = useLoading(
    loading,
    'ROOTCHAIN_GET_RECOMMENDED_GAS',
    !ethFee
  )
  const [errorAmountMessage, setErrorAmountMessage] = useState('Invalid amount')

  // Feel not quite useful since the user will be likely to select the token to send first.
  // Immediately set focus to amount input will require more effort for selecting a token.
  // useEffect(() => {
  //   if (isFocused) {
  //     if (!amountRef.current) {
  //       focusOn(amountFocusRef)
  //     }
  //   }
  // }, [dispatchGetFees, focusOn, isFocused, wallet.childchainAssets])

  // Retrieve fees from /fees.all when the component is mounted
  useEffect(() => {
    dispatchGetFees(wallet.childchainAssets)

    if (!selectedEthFee) {
      dispatchGetRecommendedGas()
    }
  }, [
    dispatchGetFees,
    dispatchGetRecommendedGas,
    selectedEthFee,
    wallet.childchainAssets
  ])

  useEffect(() => {
    setEthFee(selectedEthFee || gasOptions[0])
  }, [gasOptions, selectedEthFee])

  const navigateToSelectPlasmaFee = useCallback(() => {
    const params = paramsForTransferFormToTransferSelectPlasmaFee({
      selectedPlasmaFee,
      fees
    })
    navigation.navigate('TransferSelectPlasmaFee', params)
  }, [fees, navigation, selectedPlasmaFee])

  const navigateToSelectBalance = useCallback(() => {
    const params = paramsForTransferFormToTransferSelectBalance({
      selectedToken,
      amount: amountRef.current,
      transferType
    })

    navigation.navigate('TransferSelectBalance', params)
  }, [navigation, selectedToken, transferType])

  const valid = useCallback(
    plasmaFee => {
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
      } else if (
        transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN &&
        !plasmaFee
      ) {
      } else {
        setShowErrorAddress(false)
        setShowErrorAmount(false)
        return true
      }
      return false
    },
    [selectedToken.balance, transferType]
  )

  const submit = useCallback(() => {
    const plasmaFee =
      transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN
        ? selectedPlasmaFee || fees[0]
        : null
    if (valid(plasmaFee)) {
      navigation.navigate(
        'TransferConfirm',
        paramsForTransferFormToTransferConfirm({
          selectedToken,
          amount: amountRef.current,
          address: addressRef.current,
          selectedPlasmaFee: plasmaFee,
          wallet,
          transferType,
          selectedEthFee: ethFee
        })
      )
    }
  }, [
    ethFee,
    fees,
    navigation,
    selectedPlasmaFee,
    selectedToken,
    transferType,
    valid,
    wallet
  ])

  const navigateToTransferScanner = useCallback(() => {
    navigation.navigate(
      'TransferScanner',
      paramsForTransferFormToTransferScanner({
        isRootchain: transferType === TransferHelper.TYPE_TRANSFER_ROOTCHAIN
      })
    )
  }, [navigation, transferType])

  const navigationToTransferSelectFee = useCallback(() => {
    const params = paramsForTransferFormToTransferSelectFee({
      selectedToken,
      selectedEthFee: ethFee,
      gasOptions,
      amount: amountRef.current
    })
    navigation.navigate('TransferSelectFee', params)
  }, [ethFee, gasOptions, navigation, selectedToken])

  const renderAddressElement = useCallback(() => {
    return transferType === TransferHelper.TYPE_DEPOSIT ? (
      <OMGWalletAddress
        style={styles.mediumMarginTop}
        name='Plasma Contract'
        address={address}
      />
    ) : (
      <OMGAddressInput
        style={styles.mediumMarginTop}
        inputRef={addressRef}
        showError={showErrorAddress}
        returnKeyType='next'
        onPressScanQR={navigateToTransferScanner}
      />
    )
  }, [address, navigateToTransferScanner, showErrorAddress, transferType])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGKeyboardShift
        extraHeight={24}
        contentContainerStyle={styles.scrollView}
        androidEnabled={true}
        innerRef={ref => {
          keyboardAwareScrollRef.current = ref
        }}>
        <View style={styles.formContainer(theme)}>
          <OMGBlockchainLabel
            actionText={blockchainLabelActionText}
            transferType={transferType}
          />
          <OMGBox style={styles.fromContainer(theme)}>
            <OMGText style={styles.title(theme)}>From</OMGText>
            <OMGTokenInput
              token={selectedToken}
              style={styles.mediumMarginTop}
              onPress={navigateToSelectBalance}
            />
            <OMGWalletAddress
              name={wallet.name}
              address={wallet.address}
              style={styles.mediumMarginTop}
            />
          </OMGBox>
          <OMGBox style={styles.toContainer(theme)}>
            <OMGText style={styles.title(theme)}>To</OMGText>
            {renderAddressElement()}
          </OMGBox>
          <OMGBox style={styles.amountContainer(theme)}>
            <OMGText style={styles.title(theme)}>Amount</OMGText>
            <OMGAmountInput
              token={selectedToken}
              inputRef={amountRef}
              showError={showErrorAmount}
              errorMessage={errorAmountMessage}
              focusRef={amountFocusRef}
              defaultValue={amount}
              style={styles.mediumMarginTop}
            />
          </OMGBox>
          <OMGBox style={styles.feeContainer(theme, transferType)}>
            <OMGText style={styles.title(theme)}>Transaction Fee</OMGText>
            {transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN ? (
              <OMGFeeTokenInput
                onPress={navigateToSelectPlasmaFee}
                style={styles.mediumMarginTop}
                feeToken={selectedPlasmaFee || fees[0]}
                loading={loadingFeeToken}
              />
            ) : (
              <OMGFeeInput
                fee={ethFee}
                loading={loadingGas}
                style={styles.mediumMarginTop}
                onPress={navigationToTransferSelectFee}
              />
            )}
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
    backgroundColor: theme.colors.black3
  }),
  scrollView: {
    flexGrow: 1
  },
  formContainer: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black3
  }),
  fromContainer: theme => ({
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.black3
  }),
  toContainer: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
  }),
  amountContainer: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
  }),
  feeContainer: (theme, transferType) => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
  }),
  mediumMarginTop: {
    marginTop: Styles.getResponsiveSize(16, { small: 8, medium: 12 })
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
    paddingHorizontal: 16
  },
  title: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 10 }),
    textTransform: 'uppercase'
  })
})

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  loading: state.loading,
  fees: state.fees.data,
  gasOptions: state.gasOptions
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchGetFees: tokens => dispatch(plasmaActions.getFees(tokens)),
  dispatchGetRecommendedGas: () => dispatch(ethereumActions.getRecommendedGas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(TransferForm)))
