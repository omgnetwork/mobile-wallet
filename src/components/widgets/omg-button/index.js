import React, { useRef, Fragment, useEffect } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator
} from 'react-native'
import { withTheme } from 'react-native-paper'
import { Push, Fade } from 'common/anims'
import OMGText from '../omg-text'

const OMGButton = ({
  disabled,
  style,
  textStyle,
  textWeight = 'semi-bold',
  children,
  onPress,
  loading,
  theme
}) => {
  const opacity = disabled || loading ? styles.inactive : styles.active
  const scale = useRef(new Animated.Value(1.0))
  const fade = useRef(new Animated.Value(1.0))

  const textLayout = loading ? (
    <Fragment>
      <ActivityIndicator
        animating={loading || false}
        color={theme.colors.new_black6}
        style={{ ...styles.icon }}
      />
      <OMGText
        style={{ ...styles.text(theme), ...textStyle }}
        weight={textWeight}>
        {children}
      </OMGText>
    </Fragment>
  ) : (
    <OMGText
      style={{ ...styles.text(theme), ...textStyle }}
      weight={textWeight}>
      {children}
    </OMGText>
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
        ...styles.container(theme),
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
  text: theme => ({
    color: theme.colors.new_black6,
    textAlign: 'center',
    fontSize: 16,
    textTransform: 'uppercase'
  }),
  container: theme => ({
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row'
  }),
  inactive: {
    opacity: 0.5
  },
  active: {
    opacity: 1.0
  }
})

export default withTheme(OMGButton)
