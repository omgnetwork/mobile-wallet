import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import Svg, { Rect, Path } from 'react-native-svg'
import { Dimensions } from 'common/utils'
import { OMGText } from 'components/widgets'

const SCREEN_WIDTH = Dimensions.windowWidth
export const CONTAINER_WIDTH = Math.round(SCREEN_WIDTH * 0.68)

const OMGQRScanner = props => {
  const {
    reactivate,
    renderTop,
    renderBottom,
    borderColor,
    rootchain,
    borderStrokeWidth,
    cameraRef,
    renderUnconfirmedTx,
    renderEmptyComponent,
    unconfirmedTx,
    wallet,
    theme
  } = props

  const hasRootchainAssets = wallet?.rootchainAssets?.length > 0
  const hasChildchainAssets = wallet?.childchainAssets?.length > 0
  const shouldRenderEmptyView =
    (rootchain && !hasRootchainAssets) || (!rootchain && !hasChildchainAssets)
  const renderQRMarker = (
    <View style={styles.qrMarkerContainer}>
      <QRMarker
        borderColor={borderColor}
        borderStrokeWidth={borderStrokeWidth}
      />
    </View>
  )

  const renderContent = useCallback(() => {
    if (unconfirmedTx) {
      disableScanner()
      return renderUnconfirmedTx
    } else if (shouldRenderEmptyView) {
      disableScanner()
      return renderEmptyComponent
    } else {
      enableScanner()
      return renderQRMarker
    }
  }, [
    unconfirmedTx,
    shouldRenderEmptyView,
    disableScanner,
    renderUnconfirmedTx,
    renderEmptyComponent,
    enableScanner,
    renderQRMarker
  ])

  const handleOnRead = e => {
    if (shouldRenderEmptyView) return
    if (unconfirmedTx) return
    props.onReceiveQR(e)
  }

  const disableScanner = useCallback(() => {
    cameraRef.current?.disable()
  }, [cameraRef])

  const enableScanner = useCallback(() => {
    cameraRef.current?.enable()
  }, [cameraRef])

  return (
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
        <View>
          <OMGText style={styles.loadingText(theme)}>Loading...</OMGText>
        </View>
      }
      customMarker={
        <View style={styles.contentContainer(theme)}>
          <View style={styles.topContainer}>
            <View style={styles.renderContainer}>{renderTop}</View>
          </View>
          <View style={styles.scannerContainer}>
            <View style={styles.sideOverlay} />
            <View style={styles.renderScannerContainer}>{renderContent()}</View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.renderContainer}>{renderBottom}</View>
          </View>
        </View>
      }
    />
  )
}

const QRMarker = ({ borderColor, borderStrokeWidth, borderStrokeLength }) => {
  const width = CONTAINER_WIDTH
  const height = width
  const strokeColor = borderColor || 'white'
  const strokeWidth = borderStrokeWidth || 8
  const strokeLength = borderStrokeLength || 54
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
  contentContainer: theme => ({
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    backgroundColor: theme.colors.black3,
    justifyContent: 'space-around'
  }),
  topContainer: {
    width: SCREEN_WIDTH,
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    flex: 1
  },
  renderContainer: {
    width: CONTAINER_WIDTH
  },
  renderScannerContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_WIDTH
  },
  scannerContainer: {
    flexDirection: 'row'
  },
  sideOverlay: {
    flex: 1
  },
  loadingText: theme => ({
    textAlign: 'center',
    color: theme.colors.white
  }),
  qrMarkerContainer: {
    alignItems: 'center'
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
)(withTheme(OMGQRScanner))
