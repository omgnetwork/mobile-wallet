import { Animated, Easing } from 'react-native'

export const In = fade => {
  console.log('fadein')
  Animated.spring(fade, {
    toValue: 1.0,
    easing: Easing.back(),
    duration: 300,
    useNativeDriver: true
  }).start()
}

export const Out = fade => {
  console.log('fadeout')
  Animated.spring(fade, {
    toValue: 0.0,
    easing: Easing.back(),
    duration: 300,
    useNativeDriver: true
  }).start()
}
