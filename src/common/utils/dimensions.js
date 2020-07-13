import { Dimensions, StatusBar, Platform } from 'react-native'

const X_WIDTH = 375
const X_HEIGHT = 812

const XSMAX_WIDTH = 414
const XSMAX_HEIGHT = 896

export let isIPhoneX = false

export const windowWidth = Math.round(Dimensions.get('window').width)
export const windowHeight =
  Platform.OS === 'android'
    ? Math.round(Dimensions.get('window').height - StatusBar.currentHeight)
    : Math.round(Dimensions.get('window').height)

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window')

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
  isIPhoneX =
    (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) ||
    (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT)
}

export function getStatusBarHeight(skipAndroid) {
  return Platform.select({
    ios: isIPhoneX ? 44 : 20,
    android: skipAndroid ? 0 : StatusBar.currentHeight,
    default: 0
  })
}
