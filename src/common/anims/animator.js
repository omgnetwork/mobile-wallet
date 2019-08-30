import { Animated } from 'react-native'

export const spring = (animRef, toValue, duration) => {
  return Animated.spring(animRef.current, {
    toValue: toValue,
    duration: duration,
    useNativeDriver: true
  })
}
