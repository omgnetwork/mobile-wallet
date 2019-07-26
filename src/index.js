import React, { Fragment } from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import Router from './router'
import store from './common/stores'

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.safeAreaView}>
        <Provider store={store}>
          <Router />
        </Provider>
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
