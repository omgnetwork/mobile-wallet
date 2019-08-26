import React, { useState, useEffect } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { OMGIcon, OMGBox, OMGText, OMGStatusBar } from 'components/widgets'

const Transfer = ({ navigation, theme }) => {
  const [rendering, setRendering] = useState(true)
  const RootChainTransferNavigator = navigation.getParam('navigator')

  useEffect(() => {
    function willFocus() {
      StatusBar.setBarStyle('dark-content')
      StatusBar.setBackgroundColor(theme.colors.white)
      setRendering(true)
    }
    function willBlur() {
      setRendering(false)
    }

    const willFocusSubscription = navigation.addListener('willFocus', willFocus)
    const willBlurSubscription = navigation.addListener('willBlur', willBlur)

    return () => {
      willBlurSubscription.remove()
      willFocusSubscription.remove()
    }
  }, [navigation, theme.colors.white])

  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <View style={styles.titleContainer}>
        <OMGText style={styles.title(theme)}>Transfer</OMGText>
        <OMGBox
          onPress={() => {
            navigation.goBack()
          }}
          style={styles.icon}>
          <OMGIcon name='x-mark' size={18} color={theme.colors.gray3} />
        </OMGBox>
      </View>
      {rendering && <RootChainTransferNavigator navigation={navigation} />}
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
  icon: {
    padding: 16
  }
})

export default withTheme(Transfer)
