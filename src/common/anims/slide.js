import { Animated, Easing } from 'react-native'

export const Up = slideAnim => {
  Animated.spring(slideAnim, {
    toValue: 0,
    easing: Easing.back(),
    duration: 300,
    bounciness: 0,
    restSpeedThreshold: 0.005,
    speed: 2,
    useNativeDriver: true
  }).start()
}

export const Down = (slideAnim, offset) => {
  Animated.spring(slideAnim, {
    toValue: offset,
    easing: Easing.back(),
    duration: 300,
    bounciness: 0,
    restSpeedThreshold: 0.005,
    speed: 1,
    useNativeDriver: true
  }).start()
}
