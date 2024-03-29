import { settingActions, walletActions } from 'common/actions'
import { store } from 'common/stores'
import { HeadlessProcessExit } from 'components/headless'
import React, { useRef, useEffect, useState } from 'react'
import { AppRegistry, StyleSheet, View, Animated, Platform } from 'react-native'
import { SecureEncryption } from 'common/native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { OMGStatusBar } from 'components/widgets'
import { Move } from 'common/anims'
import { ABIDecoder, Contract, ContractABI } from 'common/blockchain'
import { ExceptionReporter } from 'common/reporter'
import OmiseGOLogo from './assets/omisego.svg'

const Initializer = ({
  theme,
  children,
  blockchainWallet,
  wallet,
  primaryWalletNetwork,
  dispatchSetPrimaryWallet,
  dispatchSetBlockchainWallet,
  dispatchDeleteAllWallet,
  loading,
  provider,
  navigation,
  wallets
}) => {
  const move = useRef(new Animated.Value(0))
  const [ready, setReady] = useState(false)
  const loadingAnim = Animated.loop(
    Animated.sequence([Move.To(move.current, 123), Move.To(move.current, 0)])
  )
  const loadingDuration = 1000 + Math.random() * 1000

  useEffect(() => {
    if (loading.action === 'SETTING_SET_BLOCKCHAIN_WALLET' && loading.failed) {
      dispatchDeleteAllWallet()
      navigation.navigate('Welcome')
    }
  }, [loading])

  useEffect(() => {
    async function init() {
      if (Platform.OS === 'android') {
        await SecureEncryption.init()
      }
      if (ABIDecoder.get().getABIs().length === 0) {
        const erc20Abi = ContractABI.erc20Abi()
        const plasmaContractAbi = Contract.getPlasmaContractABI()
        const plasmaAbis = await Promise.all([
          Contract.getPaymentExitGameABI(),
          Contract.getERC20VaultABI(),
          Contract.getEthVaultABI()
        ])
        ABIDecoder.init([erc20Abi, plasmaContractAbi, ...plasmaAbis])
      }
      setReady(true)
    }

    ExceptionReporter.reportWhenError(init)
  }, [])

  useEffect(() => {
    if (!ready) {
      return
    } else if (wallets.length === 0) {
      navigation.navigate('Welcome')
    } else if (wallet && provider && blockchainWallet) {
      navigation.navigate('MainContent')
    } else if (shouldGetBlockchainWallet(wallet, blockchainWallet, provider)) {
      setTimeout(() => {
        dispatchSetBlockchainWallet(wallet, provider)
      }, loadingDuration)
    } else if (shouldSetPrimaryWallet(wallet, wallets)) {
      dispatchSetPrimaryWallet(wallets[0], primaryWalletNetwork)
    }
  }, [
    blockchainWallet,
    dispatchSetBlockchainWallet,
    dispatchSetPrimaryWallet,
    loadingDuration,
    navigation,
    primaryWalletNetwork,
    provider,
    ready,
    wallet,
    wallets
  ])

  useEffect(() => {
    loadingAnim.start()
    return loadingAnim.stop
  }, [loadingAnim])

  useEffect(() => {
    if (Platform.OS === 'android') {
      AppRegistry.registerHeadlessTask('HeadlessProcessExit', () =>
        HeadlessProcessExit.bind(null, store)
      )
    }
  }, [])

  const renderChildren = () => {
    if (wallets.length === 0) {
      return <>{children}</>
    } else if (wallet && blockchainWallet && provider) {
      return <>{children}</>
    } else {
      return (
        <SafeAreaView style={styles.container(theme)}>
          <OMGStatusBar
            barStyle={'light-content'}
            backgroundColor={theme.colors.black5}
          />
          <View style={styles.contentContainer}>
            <OmiseGOLogo fill={theme.colors.white} />
            <Animated.View style={styles.loading(theme, move)} />
          </View>
        </SafeAreaView>
      )
    }
  }

  return renderChildren()
}

const shouldGetBlockchainWallet = (wallet, blockchainWallet, provider) => {
  return wallet && provider && !blockchainWallet
}

const shouldSetPrimaryWallet = (wallet, wallets) => {
  return !wallet && wallets.length > 0
}
const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: theme.colors.black5
  }),
  contentContainer: {
    width: 173.892,
    alignItems: 'flex-start'
  },
  loading: (theme, move) => ({
    marginTop: 16,
    transform: [{ translateX: move.current }],
    width: 50,
    height: 4,
    backgroundColor: theme.colors.blue
  })
})

const mapStateToProps = (state, _ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider,
  blockchainWallet: state.setting.blockchainWallet,
  primaryWalletNetwork: state.setting.primaryWalletNetwork,
  unconfirmedTxs: state.transaction.unconfirmedTxs
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchSetBlockchainWallet: (wallet, provider) =>
    dispatch(settingActions.setBlockchainWallet(wallet, provider)),
  dispatchSetPrimaryWallet: (wallet, network) =>
    settingActions.setPrimaryWallet(dispatch, wallet.address, network),
  dispatchDeleteAllWallet: () => walletActions.clear(dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Initializer)))
