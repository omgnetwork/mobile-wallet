import React from 'react'
import { View, Animated, TouchableOpacity } from 'react-native'

const Tab = ({ focusAnim, title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, flexDirection: 'column' }}>
      <Animated.View
        style={{
          padding: 12,
          justifyContent: 'center',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          marginLeft: title === 'Send' ? 16 : 0,
          marginRight: title === 'Receive' ? 16 : 0,
          backgroundColor: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', '#04070d']
          })
        }}>
        <Animated.Text
          style={{
            textAlign: 'center',
            textTransform: 'uppercase',
            color: focusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#3c414d', '#ffffff']
            })
          }}>
          {title}
        </Animated.Text>
      </Animated.View>
      <Animated.View
        style={{
          backgroundColor: '#04070d',
          height: 4
        }}
      />
    </TouchableOpacity>
  )
}

const OMGTab = props => {
  const { navigationState, navigation, position } = props
  return (
    <View
      style={{
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center'
      }}>
      {navigationState.routes.map((route, index) => {
        const focusAnim = position.interpolate({
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

export default OMGTab
