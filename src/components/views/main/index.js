import React from 'react'
import { StyleSheet, SafeAreaView, Text } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient'

const Main = ({ navigation, theme }) => {
  return (
    <LinearGradient
      colors={[theme.colors.black5, theme.colors.gray1]}
      style={styles.container}>
      <SafeAreaView>{/* <BottomTabContainer /> */}</SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16
  }
})

export default withNavigation(withTheme(Main))
