import React, { useRef, Fragment, useEffect } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator
} from 'react-native'
import { Text } from 'react-native-paper'
import { Push, Fade } from 'common/anims'

const OMGButton = ({ disabled, style, children, onPress, loading }) => {
  const opacity = disabled || loading ? styles.inactive : styles.active
  const scale = useRef(new Animated.Value(1.0))
  const fade = useRef(new Animated.Value(1.0))

  const textLayout = loading ? (
    <Fragment>
      <ActivityIndicator
        animating={loading || false}
        color='#ffffff'
        style={{ ...styles.icon }}
      />
      <Text style={styles.text}>{children}</Text>
    </Fragment>
  ) : (
    <Text style={styles.text}>{children}</Text>
  )

  useEffect(() => {
    const lastFade = fade.current
    Fade.In(lastFade)
    return () => Fade.Out(lastFade)
  }, [loading])

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={{
        ...styles.container,
        ...style,
        ...opacity,
        transform: [{ scale: scale.current }]
      }}
      onPress={onPress}
      onPressIn={() => Push.In(scale.current)}
      onPressOut={() => Push.Out(scale.current)}>
      <Animated.View style={{ opacity: fade.current, flexDirection: 'row' }}>
        {textLayout}
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 8,
    width: 16,
    height: 16
  },
  text: {
    color: '#FFFFFF',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  container: {
    borderRadius: 36,
    justifyContent: 'center',
    backgroundColor: '#334e68',
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row'
  },
  inactive: {
    opacity: 0.5
  },
  active: {
    opacity: 1.0
  }
})

export default OMGButton
