import React from 'react'
import { withNavigation, ScrollView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Animated, StyleSheet, View } from 'react-native'

const Scroll = ({ theme, elements }) => {
  return (
    <View style={styles.container}>
      <View>
        <ScrollView horizontal={true}>{elements}</ScrollView>
        <View style={styles.scrollDots}>
          {elements.map((_, index) => {
            return <Animated.View key={index} style={styles.dot(theme)} />
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
