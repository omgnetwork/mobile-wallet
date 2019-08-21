import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGIcon, OMGBox, OMGText } from 'components/widgets'

const Transfer = ({ navigation, theme }) => {
  const [rendering, setRendering] = useState(true)
  const TransferTabNavigator = navigation.getParam('navigator')

  useEffect(() => {
    function willFocus() {
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
  }, [navigation])

  return (
    <View style={styles.container}>
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
      {rendering && <TransferTabNavigator navigation={navigation} />}
    </View>
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
    margin: 16,
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.primary
  }),
  icon: {
    padding: 16
  }
})

export default withTheme(Transfer)
