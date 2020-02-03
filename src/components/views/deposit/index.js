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
      StatusBar.setBackgroundColor(theme.colors.gray4)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    return () => {
      didFocusSubscription.remove()
    }
  }, [navigation, theme.colors.gray4])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.white}
      />
      <View style={styles.titleContainer}>
        <OMGText style={styles.title(theme)} weight='regular'>
          Deposit
        </OMGText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Balance')
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
    backgroundColor: theme.colors.gray4
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
  iconBox: {
    padding: 16
  },
  icon: {
    opacity: 1.0
  }
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withTheme(Deposit))
