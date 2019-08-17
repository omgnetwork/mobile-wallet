import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, withTheme } from 'react-native-paper'
import { OMGTab, OMGIcon, OMGBox, OMGBackground } from 'components/widgets'
import Send from '../send'
import Receive from '../receive'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'

const TransferTabNavigator = createMaterialTopTabNavigator(
  {
    Send: {
      screen: Send
    },
    Receive: {
      screen: Receive
    }
  },
  {
    tabBarComponent: OMGTab,
    tabBarOptions: {}
  }
)

const Transfer = ({ navigation, theme }) => {
  const [rendering, setRendering] = useState(true)

  useEffect(() => {
    function willFocus() {
      setRendering(true)
    }
    function willBlur() {
      setRendering(false)
    }

    const willFocusSubscription = navigation.addListener('willFocus', willFocus)
    const willBlurSubscription = navigation.addListener('willBlur', willBlur)

    return () => {
      willBlurSubscription.remove()
      willFocusSubscription.remove()
    }
  }, [navigation])

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title(theme)}>Transfer</Text>
        <OMGBox
          onPress={() => {
            navigation.goBack()
          }}
          style={styles.icon}>
          <OMGIcon name='x-mark' size={18} color={theme.colors.icon} />
        </OMGBox>
      </View>
      {rendering && <TransferTabNavigator navigation={navigation} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: theme => ({
    flex: 1,
    margin: 16,
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.primary
  }),
  icon: {
    padding: 16
  }
})

Transfer.router = TransferTabNavigator.router

export default withTheme(Transfer)
