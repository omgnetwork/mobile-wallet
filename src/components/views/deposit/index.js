import React, { useEffect } from 'react'
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { OMGFontIcon, OMGText, OMGStatusBar } from 'components/widgets'

const Deposit = ({ navigation, theme }) => {
  const ChildChainTransferNavigator = navigation.getParam('navigator')

  useEffect(() => {
    function didFocus() {
      StatusBar.setBarStyle('light-content')
      StatusBar.setBackgroundColor(theme.colors.black5)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    return () => {
      didFocusSubscription.remove()
    }
  }, [navigation, theme.colors.black5])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <View style={styles.titleContainer}>
        <OMGText style={styles.title(theme)} weight='regular'>
          Deposit
        </OMGText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home')
          }}>
          <OMGFontIcon
            name='x-mark'
            size={18}
            color={theme.colors.white}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <ChildChainTransferNavigator navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  titleContainer: {
    paddingVertical: 24,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: theme => ({
    flex: 1,
    marginHorizontal: 16,
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.white
  }),
  icon: {
    opacity: 1.0
  }
})

const mapStateToProps = (state, _ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withTheme(Deposit))
