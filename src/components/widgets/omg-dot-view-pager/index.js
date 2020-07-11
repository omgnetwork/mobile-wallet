import React, { useEffect, useRef } from 'react'
import { withNavigation, ScrollView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Animated, StyleSheet, View } from 'react-native'
import { Dimensions } from 'common/utils'

const OMGDotViewPager = ({
  theme,
  children,
  onLastPage = () => null,
  onPageChanged = () => null,
  page,
  style
}) => {
  const { windowWidth } = Dimensions
  const scrollX = new Animated.Value(0)
  const position = Animated.divide(scrollX, windowWidth)
  const offsets = [0, windowWidth, windowWidth * 2]
  const scrollView = useRef()

  // scroll to the given page
  useEffect(() => {
    const offset = offsets[page]
    if (scrollView.current) {
      scrollView.current.scrollTo({ x: offset })
    }
  }, [page])

  const handleScroll = event => {
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }])(event)
    const { contentOffset } = event.nativeEvent

    const { x } = contentOffset
    onLastPage(x >= offsets[offsets.length - 1])

    if (x % windowWidth === 0) {
      const _page = parseInt(x / windowWidth)
      onPageChanged(_page)
    }
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        ref={scroll => (scrollView.current = scroll)}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={8}>
        {children}
      </ScrollView>
      <View style={styles.scrollDots}>
        {[...Array(3)].map((_, index) => {
          const opacity = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          })
          return (
            <Animated.View
              key={index}
              style={[styles.dot(theme), { opacity }]}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  scrollDots: {
    flexDirection: 'row'
  },
  dot: theme => ({
    height: 10,
    width: 10,
    backgroundColor: theme.colors.primary,
    marginRight: 16,
    borderRadius: 5
  })
})

export default withNavigation(withTheme(OMGDotViewPager))
