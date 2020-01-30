import React, { useCallback, useRef, useEffect } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGFontIcon, OMGText } from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Slide } from 'common/anims'

const OMGBottomSheet = ({
  theme,
  iconName,
  iconColor,
  textTitle,
  textSubtitle,
  textLink,
  style,
  onPressLink,
  onPressClose,
  show
}) => {
  const offBottom = new Animated.Value(320.0)
  const slide = useRef(offBottom)

  useEffect(() => {
    if (show) {
      Slide.Up(slide.current)
    } else {
      Slide.Down(slide.current, offBottom)
    }
  }, [offBottom, show])

  const renderLink = useCallback(() => {
    return (
      <TouchableOpacity onPress={onPressLink}>
        <OMGText style={styles.textLink(theme)}>{textLink}</OMGText>
      </TouchableOpacity>
    )
  }, [onPressLink, textLink, theme])

  return (
    <Animated.View style={{ ...styles.container(theme, slide), ...style }}>
      <View style={styles.iconContainer(iconColor)}>
        <OMGFontIcon
          name={iconName || 'pending'}
          color={theme.colors.white}
          size={14}
        />
      </View>
      <View style={styles.content}>
        <OMGText style={styles.textTitle(theme)} weight='mono-semi-bold'>
          {textTitle}
        </OMGText>
        <OMGText
          style={styles.textSubtitle(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {textSubtitle}
        </OMGText>
        {textLink && renderLink()}
      </View>
      <TouchableOpacity
        onPress={onPressClose}
        style={styles.closeIconContainer}>
        <OMGFontIcon
          style={styles.closeIcon}
          name='x-mark'
          size={14}
          color={theme.colors.gray3}
        />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: (theme, slide) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 30,
    elevation: 2,
    transform: [{ translateY: slide.current }],
    position: 'absolute',
    bottom: 0,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0
    },
    backgroundColor: theme.colors.white,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  }),
  iconContainer: color => ({
    width: 24,
    height: 24,
    backgroundColor: color,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 16
  },
  textTitle: theme => ({
    color: theme.colors.primary
  }),
  textSubtitle: theme => ({
    marginTop: 2,
    fontSize: 8,
    marginRight: 16,
    color: theme.colors.gray5
  }),
  textLink: theme => ({
    fontSize: 8,
    color: theme.colors.blue5
  }),
  closeIcon: {
    opacity: 0.4
  },
  closeIconContainer: {
    alignSelf: 'flex-start'
  }
})

export default withTheme(OMGBottomSheet)
