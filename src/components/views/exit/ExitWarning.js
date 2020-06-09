import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGButton, OMGExitPeriodWarning } from 'components/widgets'
import { Styles } from 'common/utils'

const ExitWarning = ({ theme, navigation }) => {
  const confirm = useCallback(() => {
    navigation.navigate('ExitSelectBalance')
  }, [navigation])

  return (
    <View style={styles.container(theme)}>
      <View style={styles.warningContainer}>
        <OMGExitPeriodWarning style={styles.warning} />
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
    paddingTop: 16,
    backgroundColor: theme.colors.black5,
    paddingHorizontal: 16,
    justifyContent: 'space-between'
  }),
  warningContainer: {
    alignItems: 'center'
  },
  warning: {
    marginTop: Styles.getResponsiveSize(80, { small: 64, medium: 72 }),
    height: Styles.getResponsiveSize(260, { small: 208, medium: 234 }),
    width: Styles.getResponsiveSize(322, { small: 289.8, medium: 289.8 })
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: 16
  }
})

export default withNavigation(withTheme(ExitWarning))
