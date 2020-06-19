import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { useEstimatedFee } from 'common/hooks'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { BigNumber } from 'common/utils'
import { OMGEditItem, OMGText, OMGButton } from 'components/widgets'
import { BlockchainNetworkType, ContractAddress } from 'common/constants'
import { plasmaActions, ethereumActions } from 'common/actions'

const TransferReview = ({
  theme,
  navigation,
  blockchainWallet,
  primaryWalletNetwork,
  ethToken,
  ethereumTransfer,
  plasmaTransfer,
  loading,
  wallet
}) => {
  const styles = createStyles(theme)
  const isEthereum =
    primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
  const assets = isEthereum ? wallet.rootchainAssets : wallet.childchainAssets
  const token = navigation.getParam('token')
  const amount = navigation.getParam('amount')
  const toAddress = navigation.getParam('address')
  const feeRate = navigation.getParam('feeRate')
  const amountUsd = BigNumber.multiply(amount, token.price)
  const transferToken = { ...token, balance: amount }
  const feeToken = assets.find(
    token => token.contractAddress === feeRate.currency
  )

  const [estimatedFee, estimatedFeeSymbol, estimatedFeeUsd] = useEstimatedFee({
    feeRate,
    transferToken,
    ethToken,
    isEthereum,
    blockchainWallet,
    toAddress
  })

  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    function checkBalanceAvailability() {
      if (!estimatedFee) return

      let minimumPaidAmount
      if (feeRate.currency === token.contractAddress) {
        minimumPaidAmount = BigNumber.plus(estimatedFee, amount)
      } else {
        minimumPaidAmount = estimatedFee
      }

      const hasEnoughBalance = feeToken.balance >= minimumPaidAmount
      if (!hasEnoughBalance) {
        setErrorMsg(
          `Require at least ${minimumPaidAmount} ${feeToken.tokenSymbol} to proceed.`
        )
      } else {
        setErrorMsg(null)
      }
    }

    checkBalanceAvailability()
  }, [estimatedFee, feeRate, token, feeToken])

  const onPressEditAddress = useCallback(() => {
    navigation.navigate('TransferSelectAddress')
  }, [navigation])
  const onPressEditAmount = useCallback(() => {
    navigation.navigate('TransferSelectAmount')
  }, [navigation])
  const onPressEditFee = useCallback(() => {
    isEthereum
      ? navigation.navigate('TransferChooseGasFee')
      : navigation.navigate('TransferChoosePlasmaFee')
  }, [isEthereum, navigation])

  const onSubmit = useCallback(() => {
    isEthereum
      ? ethereumTransfer(blockchainWallet, toAddress, transferToken, feeRate)
      : plasmaTransfer(blockchainWallet, toAddress, transferToken, feeRate)
  }, [
    blockchainWallet,
    ethereumTransfer,
    feeRate,
    isEthereum,
    plasmaTransfer,
    toAddress,
    transferToken
  ])

  useEffect(() => {
    if (
      ['ROOTCHAIN_SEND_TOKEN', 'CHILDCHAIN_SEND_TOKEN'].includes(
        loading.action
      ) &&
      loading.success
    ) {
      navigation.navigate('Home')
    }
  }, [loading, loading.success, navigation])

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        REVIEW
      </OMGText>
      <OMGEditItem
        title='Amount'
        rightFirstLine={`${amount} ${token.tokenSymbol}`}
        rightSecondLine={`${amountUsd} USD`}
        onPress={onPressEditAmount}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <OMGEditItem
        title='Estimated Fee'
        loading={!estimatedFee}
        rightFirstLine={`${estimatedFee} ${estimatedFeeSymbol}`}
        rightSecondLine={`${estimatedFeeUsd} USD`}
        onPress={onPressEditFee}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <OMGEditItem
        title='To'
        rightFirstLine='Address'
        rightSecondLine={toAddress}
        onPress={onPressEditAddress}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <View style={styles.buttonContainer}>
        {errorMsg && (
          <OMGText style={styles.errorMsg} weight='regular'>
            {errorMsg}
          </OMGText>
        )}
        <OMGButton
          onPress={onSubmit}
          loading={loading.show}
          disabled={!estimatedFee || errorMsg}>
          Confirm Transaction
        </OMGButton>
      </View>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 26,
      paddingBottom: 48,
      backgroundColor: theme.colors.black5
    },
    title: {
      color: theme.colors.gray2,
      lineHeight: 17
    },
    errorMsg: {
      color: theme.colors.red,
      marginBottom: 16
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    marginMedium: {
      marginTop: 16
    },
    paddingMedium: {
      padding: 12
    }
  })

const mapStateToProps = (state, _ownProps) => {
  const primaryWallet = state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )

  return {
    loading: state.loading,
    blockchainWallet: state.setting.blockchainWallet,
    primaryWalletNetwork: state.setting.primaryWalletNetwork,
    ethToken: primaryWallet.rootchainAssets.find(
      token => token.contractAddress === ContractAddress.ETH_ADDRESS
    ),
    wallet: primaryWallet
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({
  plasmaTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(plasmaActions.transfer(blockchainWallet, toAddress, token, fee)),
  ethereumTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(ethereumActions.transfer(blockchainWallet, toAddress, token, fee))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferReview)))
