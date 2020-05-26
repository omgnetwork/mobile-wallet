import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { paramsForTransferScannerToTransferSelectBalance } from './transferNavigation'
import {
  OMGText,
  OMGFontIcon,
  OMGQRScanner,
  OMGEmpty
} from 'components/widgets'
import CloseIcon from './assets/close-icon.svg'
import QRIcon from './assets/qr-icon.svg'

import { Dimensions, Styles } from 'common/utils'

const SCREEN_WIDTH = Dimensions.windowWidth
const CAMERA_TO_WIDTH_RATIO = Styles.getResponsiveSize(0.68, {
  small: 0.64,
  medium: 0.68
})
const CONTAINER_WIDTH = Math.round(SCREEN_WIDTH * CAMERA_TO_WIDTH_RATIO)

const TransferScanner = ({
  theme,
  navigation,
  wallet,
  unconfirmedTx,
  isRootchain
}) => {
  const [rendering, setRendering] = useState(true)
  const camera = useRef(null)
  const [address, setAddress] = useState(null)
  const [shouldDisableSending, setShouldDisableSending] = useState(false)
  const hasRootchainAssets =
    wallet && wallet.rootchainAssets && wallet.rootchainAssets.length > 0
  const hasChildchainAssets =
    wallet && wallet.childchainAssets && wallet.childchainAssets.length > 0

  const handleCloseClick = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  const getAssets = useCallback(() => {
    return isRootchain ? wallet.rootchainAssets : wallet.childchainAssets
  }, [isRootchain, wallet.childchainAssets, wallet.rootchainAssets])

  const navigateNext = useCallback(() => {
    navigation.navigate('TransferScannerConfirm', {
      address,
      isRootchain,
      assets: getAssets()
    })
  }, [navigation, address, isRootchain, getAssets])

  useEffect(() => {
    if (address && !shouldDisableSending) {
      navigateNext()
    }
  }, [address, shouldDisableSending, navigateNext])

  useEffect(() => {
    function didFocus() {
      requestAnimationFrame(() => {
        setRendering(true)
      })
    }
    const didFocusSubscription = navigation.addListener('didFocus', didFocus)
    return () => didFocusSubscription.remove()
  }, [navigation])

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
      setShouldDisableSending(true)
    } else if (isRootchain && !hasRootchainAssets) {
      setShouldDisableSending(true)
    } else if (!isRootchain && !hasChildchainAssets) {
      setShouldDisableSending(true)
    } else {
      setShouldDisableSending(false)
    }
  }, [hasChildchainAssets, hasRootchainAssets, isRootchain, unconfirmedTx])

  const handleReceiveClick = useCallback(() => {
    navigation.navigate('Receive')
  }, [navigation])

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

  return (
    <View style={styles.container(theme)}>
      <TouchableOpacity
        style={styles.closeButton(theme)}
        onPress={handleCloseClick}>
        <CloseIcon />
      </TouchableOpacity>
      {rendering && (
        <View style={styles.contentContainer(theme)}>
          <View style={styles.cameraContainer}>
            <OMGQRScanner
              showMarker={true}
              onReceiveQR={e => setAddress(e.data)}
              size={CONTAINER_WIDTH}
              cameraRef={camera}
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
          <View style={styles.description}>
            <OMGText style={styles.descriptionText(theme)} weight='semi-bold'>
              Scan QR Code
            </OMGText>
            <OMGText style={styles.descriptionSubText(theme)} weight='regular'>
              Align QR here to send money
            </OMGText>
          </View>
          <TouchableOpacity
            style={styles.buttonContainer(theme)}
            onPress={handleReceiveClick}>
            <QRIcon
              fill={theme.colors.white}
              width={Styles.getResponsiveSize(24, { small: 16, medium: 20 })}
              height={Styles.getResponsiveSize(24, { small: 16, medium: 20 })}
            />
            <OMGText style={styles.buttonText(theme)} weight='regular'>
              SHOW MY QR
            </OMGText>
          </TouchableOpacity>
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
    backgroundColor: theme.colors.black
  }),
  closeButton: theme => ({
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    left: 30,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray3
  }),
  descriptionText: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center'
  }),
  descriptionSubText: theme => ({
    color: theme.colors.gray2,
    textAlign: 'center'
  }),
  buttonContainer: theme => ({
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.gray4,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    paddingBottom: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    paddingLeft: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    paddingRight: Styles.getResponsiveSize(18, { small: 14, medium: 16 })
  }),
  buttonText: theme => ({
    color: theme.colors.white,
    marginLeft: 10,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 })
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
  }
})

const mapStateToProps = (state, ownProps) => ({
  unconfirmedTx: state.transaction.unconfirmedTxs.length > 0,
  isRootchain: state.setting.primaryWalletNetwork === 'Ethereum Network',
  wallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransferScanner)))
