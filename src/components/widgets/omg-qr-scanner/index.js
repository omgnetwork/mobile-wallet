import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, StyleSheet, Animated } from 'react-native'
import Svg, { Rect, Path } from 'react-native-svg'
import { Dimensions } from 'common/utils'
import { OMGText, OMGEmpty } from 'components/widgets'

const SCREEN_WIDTH = Dimensions.windowWidth
export const ROOTCHAIN_OVERLAY_COLOR = 'rgba(125, 85, 246, 0.50)'
export const CHILDCHAIN_OVERLAY_COLOR = 'rgba(33, 118, 255, 0.50)'

const OMGQRScanner = props => {
  const {
    reactivate,
    renderTop,
    renderBottom,
    borderColor,
    borderStrokeWidth,
    overlayColorAnim,
    cameraRef,
    renderPendingTx,
    renderEmptyComponent,
    pendingTx,
    wallet
  } = props

  const renderQRMarker = (
    <QRMarker borderColor={borderColor} borderStrokeWidth={borderStrokeWidth} />
  )

  const renderContent = useCallback(() => {
    if (pendingTx) {
      return renderPendingTx
    } else if (
      wallet.rootchainAssets.length === 0 ||
      wallet.childchainAssets.length === 0
    ) {
      return renderEmptyComponent
    } else {
      return renderQRMarker
    }
  }, [pendingTx, renderEmptyComponent, renderPendingTx, renderQRMarker, wallet])

  const handleOnRead = e => {
    if (!pendingTx) {
      props.onReceiveQR(e)
    }
  }

  return (
    <View style={styles.container}>
      <QRCodeScanner
        {...props}
        cameraProps={{
          useCamera2Api: false,
          androidCameraPermissionOptions: null
        }}
        ref={cameraRef}
        reactivate={reactivate}
        onRead={handleOnRead}
        pendingAuthorizationView={
          <OMGText style={styles.loadingText}>Loading...</OMGText>
        }
        customMarker={
          <View style={styles.contentContainer}>
            <Animated.View style={styles.topContainer(overlayColorAnim)}>
              {renderTop}
            </Animated.View>
            <View style={styles.scannerContainer}>
              <Animated.View style={styles.sideOverlay(overlayColorAnim)} />
              {renderContent()}
              <Animated.View style={styles.sideOverlay(overlayColorAnim)} />
            </View>
            <Animated.View style={styles.bottomContainer(overlayColorAnim)}>
              {renderBottom}
            </Animated.View>
          </View>
        }
      />
    </View>
  )
}

const QRMarker = ({ borderColor, borderStrokeWidth, borderStrokeLength }) => {
  const width = Math.round(SCREEN_WIDTH * 0.68)
  const height = width
  const strokeColor = borderColor || 'white'
  const strokeWidth = borderStrokeWidth || 4
  const strokeLength = borderStrokeLength || 30
  return (
    <Svg width={width} height={height}>
      <Rect width={width} height={height} fill='transparent' />
      <Path
        d={`M0,0 L0,${strokeLength} M0,0 L${strokeLength},0`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Path
        d={`M${width},0 L${width -
          strokeLength},0 M${width},0 L${width},${strokeLength}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Path
        d={`M0,${height} L0,${height -
          strokeLength} M0,${height} L${strokeLength},${height}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Path
        d={`M${width},${height} L${width -
          strokeLength},${height} M${width},${height} L${width},${height -
          strokeLength}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </Svg>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    alignContent: 'center'
  },
  contentContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  topContainer: overlayColorAnim => ({
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: overlayColorAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [ROOTCHAIN_OVERLAY_COLOR, CHILDCHAIN_OVERLAY_COLOR]
    })
  }),
  bottomContainer: overlayColorAnim => ({
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: overlayColorAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [ROOTCHAIN_OVERLAY_COLOR, CHILDCHAIN_OVERLAY_COLOR]
    })
  }),
  scannerContainer: {
    flexDirection: 'row'
  },
  sideOverlay: overlayColorAnim => ({
    flex: 1,
    backgroundColor: overlayColorAnim.current.interpolate({
      inputRange: [0, 1],
      outputRange: [ROOTCHAIN_OVERLAY_COLOR, CHILDCHAIN_OVERLAY_COLOR]
    })
  }),
  loadingText: {
    textAlign: 'center'
  }
})

const mapStateToProps = (state, ownProps) => ({
  pendingTx: state.transaction.pendingTxs.length > 0,
  wallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(OMGQRScanner)
