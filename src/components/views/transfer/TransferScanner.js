import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import { getParamsForTransferScannerFromTransferForm } from './transferNavigation'
import { View, StyleSheet, Animated } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { paramsForTransferScannerToTransferSelectBalance } from './transferNavigation'
import {
  OMGText,
  OMGFontIcon,
  OMGQRScanner,
  OMGButton,
  OMGEmpty
} from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Animator } from 'common/anims'
import * as BlockchainIcons from './assets'
import { Styles } from 'common/utils'

const TransferScanner = ({ theme, navigation, wallet, unconfirmedTx }) => {
  const { rootchain } = getParamsForTransferScannerFromTransferForm(navigation)
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
  const OMGIcon = BlockchainIcons.IconGo
  const ETHIcon = BlockchainIcons.IconEth
  const ethIconWidth = Styles.getResponsiveSize(18, { small: 14, medium: 16 })
  const ethIconHeight = Styles.getResponsiveSize(29, {
    small: 22,
    medium: 26
  })
  const omgIconWidth = Styles.getResponsiveSize(87, { small: 65, medium: 70 })
  const omgIconHeight = Styles.getResponsiveSize(30, {
    small: 22.5,
    medium: 24
  })
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
    navigation.navigate(
      'TransferSelectBalance',
      paramsForTransferScannerToTransferSelectBalance({
        address,
        isRootchain,
        assets: getAssets()
      })
    )
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
    <Animated.View style={styles.scannerView(theme)}>
      <OMGFontIcon
        style={styles.unableIcon(theme)}
        name='pending'
        size={16}
        color={theme.colors.gray8}
      />
      <OMGText style={styles.unableText(theme)}>
        Unable to Transfer,{'\n'}There's a pending transaction
      </OMGText>
    </Animated.View>
  )

  const emptyComponent = (
    <Animated.View style={styles.scannerView(theme)}>
      <OMGEmpty {...getEmptyStatePayload()} />
    </Animated.View>
  )

  const TopMarker = ({ text }) => {
    return (
      <Fragment>
        <View style={styles.titleContainer(theme)}>
          {isRootchain ? (
            <ETHIcon
              fill={theme.colors.white}
              width={ethIconWidth}
              height={ethIconHeight}
            />
          ) : (
            <OMGIcon
              fill={theme.colors.white}
              width={omgIconWidth}
              height={omgIconHeight}
              scale={1.1}
            />
          )}
          {isRootchain && (
            <OMGText style={styles.textEthereum(theme)} weight='bold'>
              Ethereum
            </OMGText>
          )}
          <OMGText style={styles.title(theme)} weight='mono-light'>
            {text}
          </OMGText>
        </View>
      </Fragment>
    )
  }

  const cameraComponent = (
    <OMGQRScanner
      showMarker={true}
      onReceiveQR={e => setAddress(e.data)}
      cameraRef={camera}
      borderColor={isRootchain ? theme.colors.green : theme.colors.primary}
      rootchain={isRootchain}
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
          text={
            isRootchain
              ? 'Sending on \nEthereum\nRootchain'
              : 'Sending on \nPlasma Childchain'
          }
        />
      }
      renderBottom={
        <>
          <OMGButton
            style={styles.button(theme, isRootchain)}
            disabled={shouldDisabledSendButton}
            textStyle={styles.buttonText(theme)}
            onPress={navigateNext}>
            Or, Send Manually
          </OMGButton>
          <TouchableOpacity
            style={styles.buttonChangeNetwork(theme)}
            onPress={() => {
              setIsRootchain(!isRootchain)
              transitionOverlay(isRootchain)
            }}>
            {isRootchain ? (
              <OMGIcon
                fill={theme.colors.white}
                width={omgIconWidth}
                height={omgIconHeight}
                scale={1.1}
              />
            ) : (
              <ETHIcon
                fill={theme.colors.white}
                width={ethIconWidth}
                height={ethIconHeight}
              />
            )}
            <OMGText
              weight='semi-bold'
              style={styles.textChangeNetwork(theme)}>{`Switch to send on \n${
              isRootchain ? 'Plasma Childchain' : 'Ethereum Rootchain'
            }`}</OMGText>
          </TouchableOpacity>
        </>
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
    alignContent: 'center',
    backgroundColor: theme.colors.black3
  }),
  titleContainer: theme => ({
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }),
  title: theme => ({
    color: theme.colors.white,
    marginLeft: 'auto',
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 })
  }),
  buttonText: theme => ({
    color: theme.colors.white,
    textTransform: 'none',
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 })
  }),
  button: (theme, isRootchain) => ({
    backgroundColor: isRootchain ? theme.colors.green2 : theme.colors.primary,
    borderRadius: 0,
    marginTop: 20
  }),
  buttonChangeNetwork: theme => ({
    borderWidth: 1,
    borderColor: theme.colors.white,
    flexDirection: 'row',
    paddingVertical: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Styles.getResponsiveSize(32, { small: 24, medium: 24 })
  }),
  textChangeNetwork: theme => ({
    color: theme.colors.white,
    marginLeft: 16,
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 })
  }),
  cameraContainer: {
    alignSelf: 'center',
    flex: 1
  },
  notAuthorizedView: {
    textAlign: 'center'
  },
  scannerView: theme => ({
    backgroundColor: theme.colors.black3,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  textEthereum: theme => ({
    color: theme.colors.white,
    marginLeft: 16,
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 })
  }),
  unableText: theme => ({
    color: theme.colors.gray8,
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
    borderColor: theme.colors.gray
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
