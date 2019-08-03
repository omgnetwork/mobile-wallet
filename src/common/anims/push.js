import { Animated, Easing } from 'react-native'

export const In = scale => {
  Animated.spring(scale, {
    toValue: 0.95,
    easing: Easing.back(),
    duration: 50,
    useNativeDriver: true
  }).start()
}

export const Out = scale => {
  Animated.spring(scale, {
    toValue: 1,
    easing: Easing.back(),
    duration: 50,
    useNativeDriver: true
  }).start()
}
