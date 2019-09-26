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
  const [isRootchain, setIsRootchain] = useState(rootchain)

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
      rootchain: isRootchain
    })
  }, [address, navigation, isRootchain])

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

  const pendingChildchainComponent = (
    <View style={styles.unableView}>
      <OMGIcon
        style={styles.unableIcon(theme)}
        name='pending'
        size={16}
        color={theme.colors.gray2}
      />
      <OMGText style={styles.unableText(theme)}>
        Unable to Transfer,{'\n'}There's a pending transaction
      </OMGText>
    </View>
  )

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

  const cameraComponent = (
    <OMGQRScanner
      showMarker={true}
      onReceiveQR={e => setAddress(e.data)}
      cameraRef={camera}
      renderPendingChildchain={pendingChildchainComponent}
      cameraStyle={styles.cameraContainer}
      overlayColorAnim={overlayColorAnim}
      isRootchain={isRootchain}
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
        <OMGButton style={styles.button} onPress={navigateNext}>
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
  unableView: {
    flexDirection: 'column',
    backgroundColor: 'rgba(33, 118, 255, 0.50)',
    alignItems: 'center',
    justifyContent: 'center'
  },
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

export default withNavigation(withTheme(TransferScanner))
