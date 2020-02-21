import { Animated } from 'react-native'

export const To = (object, target) => {
  return Animated.timing(object, {
    toValue: target,
    duration: 300,
    delay: 60,
    useNativeDriver: true
  })
}
