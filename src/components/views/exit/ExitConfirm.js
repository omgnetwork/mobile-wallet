import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { BlockchainRenderer } from 'common/blockchain'
import { plasmaActions } from 'common/actions'
import { ActionAlert } from 'common/constants'
import {
  OMGText,
  OMGIcon,
  OMGButton,
  OMGExitWarning,
  OMGBlockchainLabel
} from 'components/widgets'

const exitFee = {
  id: 3,
  speed: 'Safe low',
  estimateTime: 'Less than 30 minutes',
  amount: '1.5',
  symbol: 'Gwei',
  price: '0.007'
}

const ExitConfirm = ({
  theme,
  navigation,
  blockchainWallet,
  loading,
  pendingTx,
  dispatchExit
}) => {
  const token = navigation.getParam('token')
  const tokenBalance = BlockchainRenderer.renderTokenBalance(token.balance)
  const tokenPrice = BlockchainRenderer.renderTokenPrice(
    token.balance,
    token.price
  )
  const [loadingVisible, setLoadingVisible] = useState(false)

  const exit = useCallback(() => {
    dispatchExit(blockchainWallet, token, exitFee)
  }, [blockchainWallet, dispatchExit, token])

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
        pendingTx
      })
    }
  })

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View style={styles.contentContainer}>
        <View style={styles.subHeaderContainer}>
          <OMGIcon
            name='chevron-left'
            size={14}
            color={theme.colors.gray3}
            onPress={() =>
              navigation.navigate('ExitForm', {
                lastAmount: token.balance
              })
            }
          />
          <OMGText style={styles.edit}>Edit</OMGText>
        </View>
        <OMGBlockchainLabel
          actionText='Sending to'
          isRootchain={true}
          style={styles.blockchainLabel}
        />
        <View style={styles.amountContainer(theme)}>
          <OMGText style={styles.tokenBalance(theme)}>{tokenBalance}</OMGText>
          <View style={styles.balanceContainer}>
            <OMGText style={styles.tokenSymbol(theme)}>
              {token.tokenSymbol}
            </OMGText>
            <OMGText style={styles.tokenWorth(theme)}>{tokenPrice} USD</OMGText>
          </View>
        </View>
        <OMGExitWarning />
      </View>
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.button}
          loading={loadingVisible}
          onPress={exit}>
          Exit from plasma chain
        </OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white
  }),
  contentContainer: {
    flex: 1
  },
  subHeaderContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceContainer: {},
  amountContainer: theme => ({
    marginTop: 16,
    padding: 20,
    backgroundColor: theme.colors.gray4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  subHeaderTitle: {
    fontSize: 14
  },
  edit: {
    marginLeft: 3,
    opacity: 0.7
  },
  tokenBalance: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenSymbol: theme => ({
    textAlign: 'right',
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenWorth: theme => ({
    color: theme.colors.black2
  }),
  subtitle: theme => ({
    marginTop: 8,
    color: theme.colors.gray3
  }),
  blockchainLabel: {
    marginTop: 20
  }
})

const mapStateToProps = (state, ownProps) => ({
  blockchainWallet: state.setting.blockchainWallet,
  pendingTx: state.transaction.pendingTxs.slice(-1).pop(),
  loading: state.loading,
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchExit: (blockchainWallet, token, fee) =>
    dispatch(plasmaActions.exit(blockchainWallet, token, fee))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ExitConfirm)))
