import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OnboardingTourGuide } from 'components/views'

const MainContainer = ({ navigation }) => {
  const MainDrawerNavigator = navigation.getParam('navigator')

  return (
    <View style={styles.container}>
      <MainDrawerNavigator navigation={navigation} />
      <OnboardingTourGuide />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default withTheme(MainContainer)
