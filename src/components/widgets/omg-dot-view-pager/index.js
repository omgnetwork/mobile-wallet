import React, { useEffect, useCallback } from 'react'
import { withNavigation, ScrollView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Animated, StyleSheet, View } from 'react-native'
import { Dimensions } from 'common/utils'

const width = Dimensions.windowWidth

const OMGDotViewPager = ({ theme, children, onPageChanged }) => {
  const scrollX = new Animated.Value(0)
  const position = Animated.divide(scrollX, width)

  let currentPage = 0
  const handleScroll = event => {
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }])(event)
    const { contentOffset, contentSize } = event.nativeEvent
    const totalChildrenViews = children.length
    const childrenViewWidth = parseInt(contentSize.width / totalChildrenViews)
    const onFinishScrolling = contentOffset.x % childrenViewWidth === 0
    const page = parseInt(contentOffset.x / childrenViewWidth)
    if (onFinishScrolling && currentPage !== page) {
      currentPage = page
      onPageChanged(page)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
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
  container: {},
  scrollDots: {
    flexDirection: 'row',
    marginLeft: 30,
    marginBottom: 10
  },
  dot: theme => ({
    height: 10,
    width: 10,
    backgroundColor: theme.colors.white,
    marginRight: 16,
    borderRadius: 5
  })
})

export default withNavigation(withTheme(OMGDotViewPager))
