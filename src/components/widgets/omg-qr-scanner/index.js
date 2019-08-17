import React from 'react'
import { Text } from 'react-native-paper'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { View, StyleSheet, Dimensions } from 'react-native'
import Svg, { Rect, Path } from 'react-native-svg'
const SCREEN_WIDTH = Dimensions.get('window').width

const OMGQRScanner = props => {
  const { renderTop, renderBottom, borderColor, borderStrokeWidth } = props

  return (
    <View style={styles.container}>
      <QRCodeScanner
        {...props}
        onRead={props.onReceiveQR || (e => console.log(e.data))}
        pendingAuthorizationView={
          <Text style={styles.loadingText}>Loading...</Text>
        }
        customMarker={
          <View style={styles.contentContainer}>
            <View style={styles.topContainer}>{renderTop}</View>
            <View style={styles.scannerContainer}>
              <View style={styles.sideOverlay} />
              <QRMarker
                borderColor={borderColor}
                borderStrokeWidth={borderStrokeWidth}
              />
              <View style={styles.sideOverlay} />
            </View>
            <View style={styles.bottomContainer}>{renderBottom}</View>
          </View>
        }
      />
    </View>
  )
}

const QRMarker = ({ borderColor, borderStrokeWidth }) => {
  const width = Math.round(SCREEN_WIDTH * 0.5)
  const height = width
  const strokeColor = borderColor || 'white'
  const strokeWidth = borderStrokeWidth || 4
  return (
    <Svg width={width} height={height}>
      <Rect width={width} height={height} fill='transparent' />
      <Path d={`M0,0 L0,50 M0,0 L50,0`} stroke='white' strokeWidth='4' />
      <Path
        d={`M${width},0 L${width - 50},0 M${width},0 L${width},50`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Path
        d={`M0,${height} L0,${height - 50} M0,${height} L50,${height}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Path
        d={`M${width},${height} L${width -
          50},${height} M${width},${height} L${width},${height - 50}`}
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
  topContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(60, 65, 77, 0.45)'
  },
  bottomContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(60, 65, 77, 0.45)'
  },
  scannerContainer: {
    flexDirection: 'row'
  },
  sideOverlay: {
    flex: 1,
    marginTop: 0.5,
    backgroundColor: 'rgba(60, 65, 77, 0.45)'
  },
  loadingText: {
    textAlign: 'center'
  }
})

export default OMGQRScanner
