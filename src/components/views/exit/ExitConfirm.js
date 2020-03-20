import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { BlockchainDataFormatter } from 'common/blockchain'
import { plasmaActions } from 'common/actions'
import { ActionAlert, ContractAddress } from 'common/constants'
import { TransferHelper } from 'components/views/transfer'
import {
  OMGText,
  OMGFontIcon,
  OMGButton,
  OMGExitWarning,
  OMGBlockchainLabel,
  OMGEmpty
} from 'components/widgets'

const ExitConfirm = ({
  theme,
  navigation,
  ethToken,
  blockchainWallet,
  loading,
  unconfirmedTx,
  dispatchExit
}) => {
  const token = navigation.getParam('token')
  const gasUsed = navigation.getParam('gasUsed')
  const gasPrice = navigation.getParam('gasPrice')
  const exitBond = navigation.getParam('exitBond')
  const tokenBalance = BlockchainDataFormatter.formatTokenBalance(token.balance)
  const tokenPrice = BlockchainDataFormatter.formatTokenPrice(
    token.balance,
    token.price
  )
  const [estimatedFee, setEstimatedFee] = useState(null)
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState(null)
  const [loadingVisible, setLoadingVisible] = useState(false)

  const exit = useCallback(() => {
    dispatchExit(blockchainWallet, token, gasPrice)
  }, [blockchainWallet, dispatchExit, gasPrice, token])

  useEffect(() => {
    if (loading.show && ActionAlert.exit.actions.indexOf(loading.action) > -1) {
      setLoadingVisible(true)
    } else if (
      !loading.show &&
      ActionAlert.exit.actions.indexOf(loading.action) > -1
    ) {
      setLoadingVisible(false)
    } else {
      loadingVisible
    }
  }, [loading.action, loading.show, loadingVisible])

  useEffect(() => {
    if (
      loading.success &&
      ActionAlert.exit.actions.indexOf(loading.action) > -1
    ) {
      navigation.navigate('ExitPending', {
        token,
        unconfirmedTx,
        estimatedFee,
        estimatedFeeUsd
      })
    }
  })

  useEffect(() => {
    function calculateEstimatedFee() {
      const gasFee = BlockchainDataFormatter.formatGasFee(
        gasUsed,
        gasPrice,
        exitBond
      )
      console.log(gasFee)
      const usdPerEth = ethToken && ethToken.price
      const gasFeeUsd = BlockchainDataFormatter.formatTokenPrice(
        gasFee,
        usdPerEth
      )
      setEstimatedFee(gasFee)
      setEstimatedFeeUsd(gasFeeUsd)
    }
    calculateEstimatedFee()
  }, [
    blockchainWallet,
    ethToken,
    exitBond,
    gasPrice,
    gasUsed,
    token,
    tokenPrice
  ])

  const renderEstimatedFeeElement = useCallback(() => {
    return (
      <View style={[styles.exitFeeContainer, styles.marginExitFeeItem]}>
        <OMGText style={styles.exitFeeTitle(theme)}>Exit Fee</OMGText>
        <View style={styles.exitFeeContainerRight}>
          {estimatedFee ? (
            <>
              <OMGText
                style={styles.exitFeeAmount(theme)}
                ellipsizeMode='tail'
                numberOfLines={1}>
                {estimatedFee} ETH
              </OMGText>
              <OMGText style={styles.exitFeeWorth(theme)}>
                {estimatedFeeUsd} USD
              </OMGText>
            </>
          ) : (
            <OMGEmpty loading={true} />
          )}
        </View>
      </View>
    )
  }, [estimatedFee, estimatedFeeUsd, theme])

  const handleBackToEditPressed = useCallback(() => {
    navigation.navigate('ExitForm', {
      amount: token.balance
    })
  }, [navigation, token.balance])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View style={styles.contentContainer}>
        <TouchableHighlight onPress={handleBackToEditPressed}>
          <View style={styles.subHeaderContainer}>
            <OMGFontIcon
              name='chevron-left'
              size={14}
              color={theme.colors.white}
              onPress={handleBackToEditPressed}
            />
            <OMGText style={styles.edit(theme)}>Edit</OMGText>
          </View>
        </TouchableHighlight>

        <OMGBlockchainLabel
          actionText='Sending to'
          transferType={TransferHelper.TYPE_TRANSFER_ROOTCHAIN}
          style={styles.blockchainLabel}
        />
        <OMGText style={styles.subtitle(theme)}>To Exit</OMGText>
        <View style={styles.feeContainer(theme)}>
          <View style={styles.exitFeeContainer}>
            <OMGText style={styles.exitFeeTitle(theme)}>Exit Amount</OMGText>
            <View style={styles.exitFeeContainerRight}>
              <OMGText
                style={styles.exitFeeAmount(theme)}
                ellipsizeMode='tail'
                numberOfLines={1}>
                {tokenBalance} {token.tokenSymbol}
              </OMGText>
              <OMGText style={styles.exitFeeWorth(theme)}>
                {tokenPrice} USD
              </OMGText>
            </View>
          </View>
          {renderEstimatedFeeElement()}
        </View>
        <OMGExitWarning style={styles.exitwarning} />
      </View>
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.button}
          loading={loadingVisible}
          onPress={exit}>
          Confirm to Exit
        </OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5
  }),
  contentContainer: {
    flex: 1
  },
  subHeaderContainer: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  edit: theme => ({
    fontSize: 12,
    color: theme.colors.white,
    textTransform: 'uppercase',
    marginLeft: 3
  }),
  subtitle: theme => ({
    marginTop: 30,
    marginLeft: 16,
    fontSize: 12,
    textTransform: 'uppercase',
    color: theme.colors.white
  }),
  feeContainer: theme => ({
    flexDirection: 'column',
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: theme.colors.gray5,
    padding: 12
  }),
  blockchainLabel: {},
  exitwarning: {
    marginTop: 16
  },
  exitFeeAmount: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  exitFeeWorth: theme => ({
    color: theme.colors.gray6,
    fontSize: 12,
    letterSpacing: -0.48
  }),
  exitFeeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  exitFeeContainerRight: {
    marginLeft: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  exitFeeTitle: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  marginExitFeeItem: {
    marginTop: 16
  }
})

const mapStateToProps = (state, ownProps) => {
  const primaryWallet = state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )

  return {
    blockchainWallet: state.setting.blockchainWallet,
    unconfirmedTx: state.transaction.unconfirmedTxs.slice(-1).pop(),
    loading: state.loading,
    provider: state.setting.provider,
    ethToken: primaryWallet.rootchainAssets.find(
      token => token.contractAddress === ContractAddress.ETH_ADDRESS
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchExit: (blockchainWallet, token, gasPrice) =>
    dispatch(plasmaActions.exit(blockchainWallet, token, gasPrice))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ExitConfirm)))
