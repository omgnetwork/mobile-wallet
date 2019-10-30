import React from 'react'
import { withNavigation, ScrollView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'

const width = Dimensions.get('window').width

const Scroll = ({ theme, children, scrollEnd = () => {} }) => {
  const scrollX = new Animated.Value(0)
  const position = Animated.divide(scrollX, width)
  const handleScroll = event => {
    Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }])(event)
    const scrollPosition = Number(event.nativeEvent.contentOffset.x)
    const end = width * (children.length - 1)
    if (scrollPosition === end) {
      scrollEnd()
    }
  }
  return (
    <View style={styles.container}>
      <View>
        <ScrollView
          children={children}
          horizontal={true}
          pagingEnabled={true}
          onScroll={event => handleScroll(event)}
          scrollEventThrottle={8}
        />
        <View style={styles.scrollDots}>
          {children.map((_, index) => {
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
  container: {
    flex: 1
  },
  scrollDots: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  dot: theme => ({
    height: 10,
    width: 10,
    backgroundColor: theme.colors.black4,
    margin: 8,
    borderRadius: 5
  })
})

export default withNavigation(withTheme(Scroll))
