import React from 'react'
import Animated from 'react-native-reanimated'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Reanimated } from 'common/utils'
const { color } = Animated

const Tab = ({ focusAnim, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tabContainer}>
      <Animated.View style={styles.tab(title, focusAnim)}>
        <Animated.Text style={styles.tabText(focusAnim)}>{title}</Animated.Text>
      </Animated.View>
      <Animated.View style={styles.tabBottomLine} />
    </TouchableOpacity>
  )
}

const OMGTab = props => {
  const { navigationState, navigation, position } = props
  return (
    <View style={styles.omgTab}>
      {navigationState.routes.map((route, index) => {
        const focusAnim = Animated.interpolate(position, {
          inputRange: [index - 1, index, index + 1],
          outputRange: [0, 1, 0]
        })
        return (
          <Tab
            key={index}
            focusAnim={focusAnim}
            title={route.routeName}
            onPress={() => navigation.navigate(route.routeName)}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  omgTab: {
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  tab: (title, focusAnim) => ({
    padding: 12,
    justifyContent: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: title === 'Send' ? 16 : 0,
    marginRight: title === 'Receive' ? 16 : 0,
    backgroundColor: Reanimated.interpolateColors(
      focusAnim,
      [0, 1],
      ['#FFFFFF', '#04070D']
    )
  }),
  tabText: focusAnim => ({
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Reanimated.interpolateColors(
      focusAnim,
      [0, 1],
      ['#3C414D', '#FFFFFF']
    )
  }),
  tabBottomLine: {
    backgroundColor: '#04070d',
    height: 4
  }
})

export default OMGTab
