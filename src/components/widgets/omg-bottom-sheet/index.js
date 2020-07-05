import React, { useCallback, useRef, useEffect } from 'react'
import { View, StyleSheet, Animated, Linking } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGFontIcon, OMGText, OMGEmpty } from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Slide } from 'common/anims'
import { Styles } from 'common/utils'

const OMGBottomSheet = ({
  theme,
  feedback,
  style,
  renderIndicator,
  onPressClose,
  show
}) => {
  const offBottom = new Animated.Value(320.0)
  const slide = useRef(offBottom)

  const {
    hash,
    title,
    subtitle,
    pending,
    internalLink,
    externalLink
  } = feedback

  useEffect(() => {
    if (show) {
      Slide.Up(slide.current)
    } else {
      Slide.Down(slide.current, offBottom)
    }
  }, [offBottom, show])

  const Indicator = () => {
    if (renderIndicator) {
      return renderIndicator()
    } else if (pending) {
      return (
        <OMGEmpty
          loading={true}
          loadingColor={theme.colors.primary}
          style={styles.loading}
        />
      )
    } else {
      return (
        <View style={styles.iconContainer(theme.colors.green4)}>
          <OMGFontIcon name={'success'} color={theme.colors.green4} size={24} />
        </View>
      )
    }
  }

  const onTapExternalLink = useCallback(url => {
    Linking.openURL(url)
  }, [])

  const renderExternalLink = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={() => onTapExternalLink(externalLink?.url)}
        style={styles.smallMarginTop}>
        <OMGText style={styles.textLink(theme)}>{externalLink?.title}</OMGText>
      </TouchableOpacity>
    )
  }, [externalLink, onTapExternalLink, theme])

  const renderInternalLink = useCallback(() => {
    return (
      <TouchableOpacity style={styles.smallMarginTop}>
        <OMGText style={styles.textLink(theme)}>{internalLink?.title}</OMGText>
      </TouchableOpacity>
    )
  }, [internalLink, onTapExternalLink, theme])

  return (
    <Animated.View style={{ ...styles.container(theme, slide), ...style }}>
      <Indicator />
      <View style={styles.content}>
        <OMGText style={styles.textTitle(theme)} weight='regular'>
          {title}
        </OMGText>
        {subtitle && (
          <OMGText
            style={[styles.textSubtitle(theme), styles.smallMarginTop]}
            ellipsizeMode='tail'
            weight='regular'
            numberOfLines={subtitle === hash ? 1 : null}>
            {subtitle}
          </OMGText>
        )}
        <View style={styles.links}>
          {externalLink && renderExternalLink()}
          {internalLink && renderInternalLink()}
        </View>
      </View>
      <TouchableOpacity
        onPress={onPressClose}
        style={styles.closeIconContainer}>
        <OMGFontIcon
          style={styles.closeIcon}
          name='x-mark'
          size={14}
          color={theme.colors.white}
        />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: (theme, slide) => ({
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Styles.getResponsiveSize(24, { small: 16, medium: 20 }),
    paddingHorizontal: 28,
    transform: [{ translateY: slide.current }],
    position: 'absolute',
    bottom: 0,
    backgroundColor: theme.colors.gray5
  }),
  iconContainer: color => ({
    width: 30,
    height: 30,
    borderWidth: 3,
    borderColor: color,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 28
  },
  loading: {
    flex: 0
  },
  textTitle: theme => ({
    color: theme.colors.white
  }),
  textSubtitle: theme => ({
    flex: 1,
    marginTop: 2,
    fontSize: 10,
    marginRight: 16,
    color: theme.colors.white
  }),
  links: {
    marginTop: 5,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textLink: theme => ({
    fontSize: 10,
    color: theme.colors.blue
  }),
  smallMarginTop: {
    marginTop: 4
  },
  closeIcon: {
    opacity: 0.4
  },
  closeIconContainer: {
    alignSelf: 'flex-start'
  }
})

export default withTheme(OMGBottomSheet)
