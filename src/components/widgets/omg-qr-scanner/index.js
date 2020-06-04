import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import Svg, { Rect, Path } from 'react-native-svg'
import { OMGText } from 'components/widgets'

const OMGQRScanner = props => {
  const {
    reactivate,
    size,
    borderColor,
    rootchain,
    onReceiveQR,
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
    <View style={styles.qrMarkerContainer(size)}>
      <QRMarker
        borderColor={borderColor}
        borderStrokeWidth={borderStrokeWidth}
        size={size}
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
      cameraProps={{
        useCamera2Api: false,
        androidCameraPermissionOptions: null,
        ratio: '1:1'
      }}
      ref={cameraRef}
      onReceiveQR={onReceiveQR}
      cameraStyle={{ width: size, height: size }}
      containerStyle={{ width: size, height: size }}
      reactivate={reactivate}
      onRead={handleOnRead}
      pendingAuthorizationView={
        <View>
          <OMGText style={styles.loadingText(theme)}>Loading...</OMGText>
        </View>
      }
      showMarker={true}
      customMarker={renderContent()}
    />
  )
}

const QRMarker = ({
  borderColor,
  borderStrokeWidth,
  borderStrokeLength,
  size
}) => {
  const width = size
  const height = size
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
  loadingText: theme => ({
    textAlign: 'center',
    color: theme.colors.white
  }),
  qrMarkerContainer: size => ({
    width: size,
    height: size,
    alignItems: 'center'
  })
})

const mapStateToProps = (state, _ownProps) => ({
  unconfirmedTx: state.transaction.unconfirmedTxs.length > 0,
  wallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withTheme(OMGQRScanner))
