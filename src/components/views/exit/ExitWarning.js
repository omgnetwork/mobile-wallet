import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGButton, OMGExitPeriodWarning } from 'components/widgets'

const ExitWarning = ({ theme, navigation }) => {
  const confirm = useCallback(() => {
    navigation.navigate('ExitSelectToken')
  }, [navigation])

  return (
    <View style={styles.container(theme)}>
      <View style={styles.warningContainer}>
        <OMGExitPeriodWarning />
      </View>
      <View style={[styles.buttonContainer]}>
        <OMGButton onPress={confirm}>Next</OMGButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5,
    paddingHorizontal: 26,
    justifyContent: 'space-between'
  }),
  warningContainer: {
    alignItems: 'center',
    paddingHorizontal: 10
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: 16
  }
})

export default withNavigation(withTheme(ExitWarning))
