import React, { useEffect } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import {
  OMGIcon,
  OMGBox,
  OMGText,
  OMGStatusBar,
  OMGEmpty
} from 'components/widgets'

const TransactionHistory = ({ theme, navigation }) => {
  useEffect(() => {
    function didFocus() {
      StatusBar.setBarStyle('dark-content')
      StatusBar.setBackgroundColor(theme.colors.white)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    return () => {
      didFocusSubscription.remove()
    }
  }, [navigation, theme.colors.white])

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <OMGText>Transaction History</OMGText>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: theme => ({
    flex: 1,
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.gray3
  }),
  icon: {
    padding: 16,
    marginRight: -16
  },
  menuContainer: {},
  menuItem: {},
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.3
  })
})

export default withNavigation(withTheme(TransactionHistory))
