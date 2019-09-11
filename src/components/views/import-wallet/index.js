import React from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import {
  OMGIcon,
  OMGBackground,
  OMGText,
  OMGStatusBar
} from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'

const ImportWallet = ({ theme, navigation }) => {
  const ImportWalletNavigator = navigation.getParam('navigator')

  return (
    <SafeAreaView style={styles.container}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <OMGBackground style={styles.contentContainer(theme)}>
        <View style={styles.header}>
          <OMGIcon
            name='chevron-left'
            size={18}
            color={theme.colors.gray3}
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          />
          <OMGText style={styles.headerTitle(theme)}>Import Wallet</OMGText>
        </View>
        <View style={styles.line(theme)} />
        <ImportWalletNavigator navigation={navigation} />
      </OMGBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: theme => ({
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 8,
    backgroundColor: theme.colors.white
  }),
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16
  },
  headerIcon: {
    padding: 8,
    marginLeft: -8
  },
  headerTitle: theme => ({
    fontSize: 18,
    color: theme.colors.gray3,
    marginLeft: 8,
    textTransform: 'uppercase'
  }),
  line: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.white3,
    height: 6
  })
})

export default withNavigation(withTheme(ImportWallet))
