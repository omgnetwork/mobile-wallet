import React, { useEffect } from 'react'
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { OMGFontIcon, OMGText, OMGStatusBar } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'

const CreateWallet = ({ theme, navigation }) => {
  const CreateWalletNavigator = navigation.getParam('navigator')

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.gray4}
      />
      <View style={styles.contentContainer(theme)}>
        <View style={styles.header}>
          <OMGFontIcon
            name='chevron-left'
            size={18}
            color={theme.colors.white}
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          />
          <OMGText style={styles.headerTitle(theme)}>Create Wallet</OMGText>
        </View>
        <CreateWalletNavigator navigation={navigation} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.gray4
  }),
  contentContainer: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.gray4
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
    paddingVertical: 16,
    color: theme.colors.white,
    marginLeft: 8,
    textTransform: 'uppercase'
  })
})

export default withNavigation(withTheme(CreateWallet))
