import React, { useEffect } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { OMGFontIcon, OMGBox, OMGText, OMGStatusBar } from 'components/widgets'

const Deposit = ({ navigation, theme }) => {
  const ChildChainTransferNavigator = navigation.getParam('navigator')

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
    <SafeAreaView style={styles.container}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <View style={styles.titleContainer}>
        <OMGText style={styles.title(theme)}>Deposit</OMGText>
        <OMGBox
          onPress={() => {
            navigation.navigate('Balance')
          }}
          style={styles.iconBox}>
          <OMGFontIcon
            name='x-mark'
            size={18}
            color={theme.colors.gray3}
            style={styles.icon}
          />
        </OMGBox>
      </View>
      <ChildChainTransferNavigator navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: theme => ({
    flex: 1,
    marginHorizontal: 16,
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.gray3
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
