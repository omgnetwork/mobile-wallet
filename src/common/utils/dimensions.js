import { Dimensions, StatusBar, Platform } from 'react-native'

export const windowWidth = Math.round(Dimensions.get('window').width)
export const windowHeight =
  Platform.OS === 'android'
    ? Math.round(Dimensions.get('window').height - StatusBar.currentHeight)
    : Math.round(Dimensions.get('window').height)

export const bottomBarHeight = 88
