import React, { Fragment } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  StyleSheet
} from 'react-native'

import Router from './router'

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.safeAreaView}>
        <Router />
      </SafeAreaView>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  view: {
    flex: 1,
    justifyContent: 'center'
  }
})

export default App
