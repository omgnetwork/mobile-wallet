import React from 'react'
import { withNavigation, ScrollView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Animated, StyleSheet, View } from 'react-native'
import { Dimensions } from 'common/utils'

const width = Dimensions.windowWidth

const OMGDotViewPager = ({ theme, children }) => {
  const scrollX = new Animated.Value(0)
  const position = Animated.divide(scrollX, width)
  const handleScroll = event => {
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }])(event)
  }
  return (
    <View style={styles.container}>
      <View>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          onScroll={handleScroll}
          scrollEventThrottle={8}>
          {children}
        </ScrollView>
        <View style={styles.scrollDots}>
          {[...Array(3)].map((_, index) => {
            let opacity = position.interpolate({
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  scrollDots: {
    flexDirection: 'row',
    marginLeft: 30
  },
  dot: theme => ({
    height: 10,
    width: 10,
    backgroundColor: theme.colors.black4,
    margin: 8,
    borderRadius: 5
  })
})

export default withNavigation(withTheme(OMGDotViewPager))
