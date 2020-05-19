import React, { useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { BlockchainFormatter } from 'common/blockchain'
import { OMGEditItem, OMGText, OMGButton } from 'components/widgets'
import { BlockchainNetworkType } from 'common/constants'
import { plasmaActions, ethereumActions } from 'common/actions'

const TransferReview = ({
  theme,
  navigation,
  blockchainWallet,
  primaryWalletNetwork,
  ethereumTransfer,
  plasmaTransfer,
  loading
}) => {
  const styles = createStyles(theme)
  const isEthereum =
    primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
  const token = navigation.getParam('token')
  const amount = navigation.getParam('amount')
  const toAddress = navigation.getParam('address')
  const fee = navigation.getParam('fee')

  const amountUsd = BlockchainFormatter.formatTokenPrice(amount, token.price)

  const feeAmount = isEthereum
    ? fee.displayAmount
    : BlockchainFormatter.formatTokenBalanceFromSmallestUnit(
        fee.amount,
        fee.tokenDecimal,
        fee.tokenDecimal
      )
  const displayFeeAmount = isEthereum
    ? `${feeAmount} ETH`
    : `${feeAmount} ${fee.tokenSymbol}`

  const displayFeeUsd = `${BlockchainFormatter.formatTokenPrice(
    feeAmount,
    fee.price
  )} USD`

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
    const sentToken = { ...token, balance: amount }
    isEthereum
      ? ethereumTransfer(blockchainWallet, toAddress, sentToken, fee)
      : plasmaTransfer(blockchainWallet, toAddress, sentToken, fee)
  }, [
    amount,
    blockchainWallet,
    ethereumTransfer,
    fee,
    isEthereum,
    plasmaTransfer,
    toAddress,
    token
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
        title='Fee'
        rightFirstLine={displayFeeAmount}
        rightSecondLine={displayFeeUsd}
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
        <OMGButton onPress={onSubmit} loading={loading.show}>
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
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    },
    marginMedium: {
      marginTop: 16
    },
    paddingMedium: {
      padding: 12
    }
  })

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  blockchainWallet: state.setting.blockchainWallet,
  primaryWalletNetwork: state.setting.primaryWalletNetwork
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  plasmaTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(plasmaActions.transfer(blockchainWallet, toAddress, token, fee)),
  ethereumTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(ethereumActions.transfer(blockchainWallet, toAddress, token, fee))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferReview)))
