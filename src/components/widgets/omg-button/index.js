import React, { useRef, Fragment, useEffect } from 'react'
import { TouchableOpacity, Animated, ActivityIndicator } from 'react-native'
import { withTheme } from 'react-native-paper'
import { Push, Fade } from 'common/anims'
import OMGText from '../omg-text'
import omgButtonStyles from './styles'

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
  const fade = useRef(new Animated.Value(1.0))
  const scale = useRef(new Animated.Value(1.0))
  const styles = omgButtonStyles(theme)
  const opacity = disabled || loading ? styles.inactive : styles.active

  const textLayout = loading ? (
    <Fragment>
      <ActivityIndicator
        animating={loading || false}
        color={theme.colors.black2}
        style={{ ...styles.icon }}
      />
      <OMGText style={{ ...styles.text, ...textStyle }} weight={textWeight}>
        {children}
      </OMGText>
    </Fragment>
  ) : (
    <OMGText style={{ ...styles.text, ...textStyle }} weight={textWeight}>
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
        ...styles.container,
        ...style,
        ...opacity,
        transform: [{ scale: scale.current }]
      }}
      onPress={onPress}
      onPressIn={() => Push.In(scale.current)}
      onPressOut={() => Push.Out(scale.current)}>
      <Animated.View
        style={[styles.contentContainer, { opacity: fade.current }]}>
        {textLayout}
      </Animated.View>
    </TouchableOpacity>
  )
}

export default withTheme(OMGButton)
