import React, { useRef, Fragment, useEffect } from 'react'
import {
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import { withTheme } from 'react-native-paper'
import { Push, Fade } from 'common/anims'
import OMGText from '../omg-text'
import { Styles } from 'common/utils'

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
  const opacity = disabled || loading ? styles.inactive : styles.active

  const textLayout = loading ? (
    <Fragment>
      <ActivityIndicator
        animating={loading || false}
        color={theme.colors.black2}
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
        ...styles.container(theme, disabled),
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

const styles = StyleSheet.create({
  icon: {
    marginRight: 8,
    width: 16,
    height: 16
  },
  text: theme => ({
    color: theme.colors.black2,
    textAlign: 'center',
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    textTransform: 'uppercase'
  }),
  container: (theme, disabled) => ({
    justifyContent: 'center',
    backgroundColor: disabled ? theme.colors.gray9 : theme.colors.white,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 22,
    paddingHorizontal: 8,
    paddingVertical: 12,
    flexDirection: 'row'
  }),
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inactive: {
    opacity: 0.5
  },
  active: {
    opacity: 1.0
  }
})

export default withTheme(OMGButton)
