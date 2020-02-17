import React, { useEffect } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import {
  OMGFontIcon,
  OMGText,
  OMGStatusBar,
  OMGEmpty
} from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Exit = ({ navigation, theme, primaryWallet }) => {
  const ExitNavigator = navigation.getParam('navigator')

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
        <OMGText style={styles.title(theme)}>Exit</OMGText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Balance')
          }}
          style={styles.icon}>
          <OMGFontIcon name='x-mark' size={18} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
      {primaryWallet ? (
        <ExitNavigator navigation={navigation} />
      ) : (
        <OMGEmpty
          text={'The wallet is not found. Try import a wallet first.'}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  titleContainer: {
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
    padding: 16
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
)(withTheme(Exit))
