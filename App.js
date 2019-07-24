import React, { Fragment } from 'react'
import { SafeAreaView, ScrollView, StatusBar, View } from 'react-native'
import Home from './src/components/views/home'

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior='automatic'>
          <View>
            <Home />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  )
}

export default App
