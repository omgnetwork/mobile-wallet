import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import {
  OMGIcon,
  OMGBox,
  OMGText,
  OMGStatusBar,
  OMGEmpty
} from 'components/widgets'

const TransactionHistoryFilter = ({ theme, navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <OMGText>Transaction History Filter</OMGText>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
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

export default withNavigation(withTheme(TransactionHistoryFilter))
