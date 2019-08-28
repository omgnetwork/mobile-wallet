import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { OMGText, OMGIcon, OMGQRScanner, OMGButton } from 'components/widgets'

const TransferScanner = ({ theme, navigation }) => {
  const camera = useRef(null)
  const [address, setAddress] = useState(null)

  const navigateNext = useCallback(() => {
    let cleanAddress = address
    if (address) {
      cleanAddress =
        address.indexOf('ethereum:') > -1
          ? address.replace('ethereum:', '')
          : address
    }
    navigation.navigate('TransferForm', { address: cleanAddress })
  }, [address, navigation])

  useEffect(() => {
    if (address) {
      navigateNext()
    }
  }, [address, navigateNext])

  const TopView = () => {
    return (
      <Fragment>
        <View style={styles.titleContainer(theme)}>
          <OMGIcon color={theme.colors.white} size={40} name='on-chain' />
          <OMGText style={styles.title(theme)}>
            Sending on {'\n'}Ethereum Rootchain
          </OMGText>
        </View>
        <View style={styles.line(theme)} />
        <OMGText style={styles.normalText(theme)}>
          Switch to Plasma Childchain
        </OMGText>
      </Fragment>
    )
  }

  return (
    <View style={styles.contentContainer(theme)}>
      <OMGQRScanner
        showMarker={true}
        onReceiveQR={e => setAddress(e.data)}
        cameraRef={camera}
        cameraStyle={styles.cameraContainer}
        notAuthorizedView={
          <OMGText style={styles.notAuthorizedView}>
            Enable the camera permission to scan a QR code.
          </OMGText>
        }
        renderTop={<TopView />}
        renderBottom={
          <OMGButton style={styles.button} onPress={navigateNext}>
            Or, Send Manually
          </OMGButton>
        }
      />
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
    width: 250,
    height: 1,
    marginTop: 16,
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