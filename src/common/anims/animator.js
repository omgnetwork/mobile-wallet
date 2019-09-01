import { Animated } from 'react-native'

export const spring = (animRef, toValue, duration, useNativeDriver) => {
  return Animated.spring(animRef.current, {
    toValue: toValue,
    duration: duration,
    useNativeDriver: useNativeDriver
  })
}
