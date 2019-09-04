import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { OMGText, OMGIcon, OMGQRScanner, OMGButton } from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Animator } from 'common/anims'

const TransferScanner = ({ theme, navigation }) => {
  const rootchain = navigation.getParam('rootchain')
  const [rendering, setRendering] = useState(true)
  const camera = useRef(null)
  const [address, setAddress] = useState(null)
  const [rootchainScanner, setRootChainScanner] = useState(rootchain)

  const overlayColorAnim = useRef(new Animated.Value(0))

  const transitionOverlay = isRootChain => {
    if (isRootChain) {
      Animator.spring(overlayColorAnim, 1, 2000, false).start()
    } else {
      Animator.spring(overlayColorAnim, 0, 2000, false).start()
    }
  }

  const navigateNext = useCallback(() => {
    navigation.navigate('TransferForm', {
      address: address && address.replace('ethereum:', ''),
      rootchain: rootchainScanner
    })
  }, [address, navigation, rootchainScanner])

  useEffect(() => {
    if (address) {
      navigateNext()
    }
  }, [address, navigateNext])

  useEffect(() => {
    function didFocus() {
      setRendering(true)
    }
    function didBlur() {
      setRendering(false)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)
    const didBlurSubscription = navigation.addListener('didBlur', didBlur)

    return () => {
      didBlurSubscription.remove()
      didFocusSubscription.remove()
    }
  }, [navigation, theme.colors.white])

  const TopMarker = ({ textAboveLine, textBelowLine, onPressSwitch }) => {
    return (
      <Fragment>
        <View style={styles.titleContainer(theme)}>
          <OMGIcon color={theme.colors.white} size={40} name='on-chain' />
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

  return (
    <View style={styles.contentContainer(theme)}>
      {rendering && (
        <OMGQRScanner
          showMarker={true}
          onReceiveQR={e => setAddress(e.data)}
          cameraRef={camera}
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
                rootchainScanner
                  ? 'Sending on \nEthereum Rootchain'
                  : 'Sending on \nPlasma Childchain'
              }
              textBelowLine={
                rootchainScanner
                  ? 'Switch to Plasma Childchain'
                  : 'Switch to Ethereum Rootchain'
              }
              onPressSwitch={() => {
                setRootChainScanner(!rootchainScanner)
                transitionOverlay(rootchainScanner)
              }}
            />
          }
          renderBottom={
            <OMGButton style={styles.button} onPress={navigateNext}>
              Or, Send Manually
            </OMGButton>
          }
        />
      )}
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
  }
})

export default withNavigation(withTheme(TransferScanner))
