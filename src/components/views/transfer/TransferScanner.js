import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import {
  OMGText,
  OMGIcon,
  OMGQRScanner,
  OMGButton,
  OMGEmpty
} from 'components/widgets'
import {
  ROOTCHAIN_OVERLAY_COLOR,
  CHILDCHAIN_OVERLAY_COLOR
} from 'components/widgets/omg-qr-scanner'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Animator } from 'common/anims'
import * as BlockchainIcons from './assets'

const TransferScanner = ({ theme, navigation, wallet, unconfirmedTx }) => {
  const rootchain = navigation.getParam('rootchain')
  const [rendering, setRendering] = useState(true)
  const camera = useRef(null)
  const [address, setAddress] = useState(null)
  const [shouldDisabledSendButton, setShouldDisabledSendButton] = useState(
    false
  )
  const [isRootchain, setIsRootchain] = useState(rootchain)
  const hasRootchainAssets =
    wallet && wallet.rootchainAssets && wallet.rootchainAssets.length > 0
  const hasChildchainAssets =
    wallet && wallet.childchainAssets && wallet.childchainAssets.length > 0
  const overlayColorAnim = useRef(new Animated.Value(rootchain ? 0 : 1))
  const Icon = BlockchainIcons[isRootchain ? 'IconEth' : 'IconGo']
  const transitionOverlay = isRootChain => {
    if (isRootChain) {
      Animator.spring(overlayColorAnim, 1, 2000, false).start()
    } else {
      Animator.spring(overlayColorAnim, 0, 2000, false).start()
    }
  }

  const getAssets = useCallback(() => {
    return isRootchain ? wallet.rootchainAssets : wallet.childchainAssets
  }, [isRootchain, wallet.childchainAssets, wallet.rootchainAssets])

  const navigateNext = useCallback(() => {
    navigation.navigate('TransferSelectBalance', {
      address: address && address.replace('ethereum:', ''),
      rootchain: isRootchain,
      currentToken: getAssets()[0],
      lastAmount: null,
      assets: getAssets()
    })
  }, [navigation, address, isRootchain, getAssets])

  useEffect(() => {
    if (address) {
      navigateNext()
    }
  }, [address, navigateNext])

  useEffect(() => {
    function didFocus() {
      requestAnimationFrame(() => {
        setRendering(true)
      })
    }

    function didBlur() {
      setRendering(false)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    // Two levels above
    const transferNavigator = navigation
      .dangerouslyGetParent()
      .dangerouslyGetParent()

    const didParentBlurSubscription = transferNavigator.addListener(
      'didBlur',
      didBlur
    )

    return () => {
      didFocusSubscription.remove()
      didParentBlurSubscription.remove()
    }
  }, [navigation, theme.colors.white])

  const getEmptyStatePayload = useCallback(() => {
    if (isRootchain && !hasRootchainAssets) {
      return {
        imageName: 'EmptyRootchainWallet',
        text: 'Wallet is empty.\nShare wallet to receive fund.'
      }
    } else if (!isRootchain && !hasChildchainAssets) {
      return {
        imageName: 'EmptyChildchainWallet',
        text: 'Wallet is empty.\nShare wallet to receive fund.'
      }
    }
    return {}
  }, [hasChildchainAssets, hasRootchainAssets, isRootchain])

  useEffect(() => {
    if (unconfirmedTx) {
      setShouldDisabledSendButton(true)
    } else if (isRootchain && !hasRootchainAssets) {
      setShouldDisabledSendButton(true)
    } else if (!isRootchain && !hasChildchainAssets) {
      setShouldDisabledSendButton(true)
    } else {
      setShouldDisabledSendButton(false)
    }
  }, [hasChildchainAssets, hasRootchainAssets, isRootchain, unconfirmedTx])

  const unconfirmedTxComponent = (
    <Animated.View style={styles.unableView(overlayColorAnim)}>
      <OMGIcon
        style={styles.unableIcon(theme)}
        name='pending'
        size={16}
        color={theme.colors.gray2}
      />
      <OMGText style={styles.unableText(theme)}>
        Unable to Transfer,{'\n'}There's a pending transaction
      </OMGText>
    </Animated.View>
  )

  const emptyComponent = (
    <Animated.View style={styles.emptyView(overlayColorAnim)}>
      <OMGEmpty {...getEmptyStatePayload()} />
    </Animated.View>
  )

  const TopMarker = ({ textAboveLine, textBelowLine, onPressSwitch }) => {
    return (
      <Fragment>
        <View style={styles.titleContainer(theme)}>
          <Icon />
          <OMGText style={styles.title(theme)} weight='extra-bold'>
            {textAboveLine}
          </OMGText>
        </View>
        <View style={styles.line(theme)} />
        <TouchableOpacity onPress={onPressSwitch}>
          <OMGText style={styles.normalText(theme)}>{textBelowLine}</OMGText>
        </TouchableOpacity>
      </Fragment>
    )
  }

  const cameraComponent = (
    <OMGQRScanner
      showMarker={true}
      onReceiveQR={e => setAddress(e.data)}
      cameraRef={camera}
      renderUnconfirmedTx={unconfirmedTxComponent}
      renderEmptyComponent={emptyComponent}
      cameraStyle={styles.cameraContainer}
      overlayColorAnim={overlayColorAnim}
      notAuthorizedView={
        <OMGText style={styles.notAuthorizedView}>
          Enable the camera permission to scan a QR code.
        </OMGText>
      }
      renderTop={
        <TopMarker
          textAboveLine={
            isRootchain
              ? 'Sending on \nEthereum Rootchain'
              : 'Sending on \nPlasma Childchain'
          }
          textBelowLine={
            isRootchain
              ? 'Switch to Plasma Childchain'
              : 'Switch to Ethereum Rootchain'
          }
          onPressSwitch={() => {
            setIsRootchain(!isRootchain)
            transitionOverlay(isRootchain)
          }}
        />
      }
      renderBottom={
        <OMGButton
          style={styles.button}
          disabled={shouldDisabledSendButton}
          onPress={navigateNext}>
          Or, Send Manually
        </OMGButton>
      }
    />
  )

  return (
    <View style={styles.contentContainer(theme)}>
      {rendering && cameraComponent}
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: theme => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    alignContent: 'center'
  }),
  titleContainer: theme => ({
    flexDirection: 'row',
    alignItems: 'center'
  }),
  title: theme => ({
    color: theme.colors.white,
    marginLeft: 16,
    fontSize: 18
  }),
  line: theme => ({
    width: 246,
    height: 1,
    marginTop: 16,
    opacity: 0.5,
    backgroundColor: theme.colors.white
  }),
  headerContainer: {
    alignItems: 'center',
    marginTop: 16
  },
  footerContainer: {
    alignItems: 'center',
    alignContent: 'center',
    paddingVertical: 8
  },
  button: {
    width: 300
  },
  cameraContainer: {
    alignSelf: 'center',
    flex: 1
  },
  normalText: theme => ({
    color: theme.colors.white,
    marginTop: 16
  }),
  notAuthorizedView: {
    textAlign: 'center'
  },
  unableView: overlayColorAnim => ({
    flexDirection: 'column',
    backgroundColor: overlayColorAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [ROOTCHAIN_OVERLAY_COLOR, CHILDCHAIN_OVERLAY_COLOR]
    }),
    alignItems: 'center',
    justifyContent: 'center'
  }),
  emptyView: overlayColorAnim => ({
    height: 240,
    flexDirection: 'column',
    backgroundColor: overlayColorAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [ROOTCHAIN_OVERLAY_COLOR, CHILDCHAIN_OVERLAY_COLOR]
    }),
    alignItems: 'center',
    justifyContent: 'center'
  }),
  unableText: theme => ({
    color: theme.colors.gray2,
    marginTop: 24,
    textAlign: 'center'
  }),
  unableIcon: theme => ({
    width: 24,
    height: 24,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 2,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: theme.colors.gray6
  })
})

const mapStateToProps = (state, ownProps) => ({
  unconfirmedTx: state.transaction.unconfirmedTxs.length > 0,
  wallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransferScanner)))
