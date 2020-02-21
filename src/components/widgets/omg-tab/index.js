import React from 'react'
import Animated from 'react-native-reanimated'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Reanimated } from 'common/utils'
import { withTheme } from 'react-native-paper'

const Tab = ({ focusAnim, title, onPress, theme }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabContainer}
      activeOpacity={0.78}>
      <Animated.View style={styles.tab(title, focusAnim, theme)}>
        <Animated.Text style={styles.tabText(focusAnim, theme)}>
          {title}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

const OMGTab = props => {
  const { navigationState, navigation, position, theme } = props
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
            theme={theme}
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
  tab: (title, focusAnim, theme) => ({
    paddingVertical: 16,
    justifyContent: 'center',
    backgroundColor: Reanimated.interpolateColors(
      focusAnim,
      [0, 1],
      [theme.colors.black5, theme.colors.gray3]
    )
  }),
  tabText: (focusAnim, theme) => ({
    textAlign: 'center',
    textTransform: 'uppercase',
    color: Reanimated.interpolateColors(
      focusAnim,
      [0, 1],
      [theme.colors.gray4, theme.colors.white]
    )
  })
})

export default withTheme(OMGTab)
