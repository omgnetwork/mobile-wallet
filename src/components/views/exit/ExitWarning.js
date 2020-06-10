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
    backgroundColor: theme.colors.black5,
    paddingHorizontal: 16,
    justifyContent: 'space-between'
  }),
  warningContainer: {
    alignItems: 'center',
    paddingHorizontal: 40
  },
  warning: {
    marginTop: Styles.getResponsiveSize(96, { small: 64, medium: 72 }),
    paddingBottom: 80
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: 16
  }
})

export default withNavigation(withTheme(ExitWarning))
