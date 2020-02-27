import React, { useEffect } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import {
  OMGFontIcon,
  OMGBox,
  OMGText,
  OMGStatusBar,
  OMGEmpty
} from 'components/widgets'

const ProcessExit = ({ navigation, theme, primaryWallet }) => {
  const ProcessExitNavigator = navigation.getParam('navigator')
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
    <SafeAreaView
      style={styles.container(theme)}
      forceInset={{ bottom: 'never' }}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <View style={styles.titleContainer}>
        <OMGText style={styles.title(theme)}>Process Exit</OMGText>
        <OMGBox
          onPress={() => {
            navigation.goBack()
          }}
          style={styles.iconBox(theme)}>
          <OMGFontIcon
            name='x-mark'
            size={18}
            color={theme.colors.white}
            style={styles.icon}
          />
        </OMGBox>
      </View>
      {primaryWallet ? (
        <ProcessExitNavigator navigation={navigation} />
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
  iconBox: theme => ({
    padding: 16,
    backgroundColor: theme.colors.black5
  })
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withTheme(ProcessExit))
