import React, { useState, useEffect, useCallback, useRef } from 'react'
import { getParamsForTransferScannerFromTransferForm } from './transferNavigation'
import { View, StyleSheet, Animated, Platform } from 'react-native'
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
import * as BlockchainIcons from './assets'
import { Dimensions, Styles } from 'common/utils'

const SCREEN_WIDTH = Dimensions.windowWidth
const CAMERA_TO_WIDTH_RATIO = Styles.getResponsiveSize(0.68, {
  small: 0.56,
  medium: 0.64
})
const CONTAINER_WIDTH = Math.round(SCREEN_WIDTH * CAMERA_TO_WIDTH_RATIO)

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

    async function getRatios() {
      if (Platform.OS === 'android') {
        console.log(await camera.current?.getSupportedRatiosAsync())
      }
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

    getRatios()

    return () => {
      didFocusSubscription.remove()
      didParentBlurSubscription.remove()
    }
  }, [navigation, theme.colors.white])

  const getEmptyStatePayload = useCallback(() => {
    if (isRootchain && !hasRootchainAssets) {
      return {
        imageName: 'EmptyRootchainWallet',
        text: 'Your Wallet is empty.\nDeposit funds to get started.'
      }
    } else if (!isRootchain && !hasChildchainAssets) {
      return {
        imageName: 'EmptyChildchainWallet',
        text: 'Your Wallet is empty.\nDeposit funds to get started.'
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
      <>
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
      </>
    )
  }

  return (
    <View style={styles.container(theme)}>
      {rendering && (
        <View style={styles.contentContainer(theme)}>
          <View style={styles.topContainer}>
            <View style={styles.renderContainer}>
              <TopMarker
                text={
                  isRootchain
                    ? 'Sending on \nEthereum'
                    : 'Sending on \nOMG Network'
                }
              />
            </View>
          </View>
          <View style={styles.cameraContainer}>
            <OMGQRScanner
              showMarker={true}
              onReceiveQR={e => setAddress(e.data)}
              size={CONTAINER_WIDTH}
              cameraRef={camera}
              ref={camera}
              borderColor={
                isRootchain ? theme.colors.green : theme.colors.primary
              }
              rootchain={isRootchain}
              renderUnconfirmedTx={unconfirmedTxComponent}
              renderEmptyComponent={emptyComponent}
              notAuthorizedView={
                <OMGText style={styles.notAuthorizedView}>
                  Enable the camera permission to scan a QR code.
                </OMGText>
              }
            />
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.renderContainer}>
              <OMGButton
                style={styles.button(theme, isRootchain)}
                disabled={shouldDisabledSendButton}
                textStyle={styles.buttonText(theme)}
                onPress={navigateNext}>
                Send Manually
              </OMGButton>
              <TouchableOpacity
                style={styles.buttonChangeNetwork(theme)}
                onPress={() => {
                  setIsRootchain(!isRootchain)
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
                  style={styles.textChangeNetwork(
                    theme
                  )}>{`Switch to send on \n${
                  isRootchain ? 'OMG Network' : 'Ethereum'
                }`}</OMGText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
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
    borderRadius: 0
  }),
  buttonChangeNetwork: theme => ({
    borderWidth: 1,
    borderColor: theme.colors.white,
    flexDirection: 'row',
    paddingVertical: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  }),
  textChangeNetwork: theme => ({
    color: theme.colors.white,
    marginLeft: 16,
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 })
  }),
  notAuthorizedView: {
    textAlign: 'center'
  },
  scannerView: theme => ({
    backgroundColor: theme.colors.black3,
    flex: 1,
    width: '100%',
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
  }),

  contentContainer: theme => ({
    flex: 1,
    justifyContent: 'center'
  }),
  cameraContainer: {
    flex: Styles.getResponsiveSize(0.4, { small: 0.64, medium: 0.5 })
  },
  topContainer: {
    flex: 0.2,
    justifyContent: 'center'
  },
  bottomContainer: {
    flex: 0.4,
    justifyContent: 'center'
  },
  renderContainer: {
    width: CONTAINER_WIDTH
  }
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
