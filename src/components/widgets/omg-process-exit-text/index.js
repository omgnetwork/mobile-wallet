import React, { useCallback } from 'react'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { OMGText, OMGEmpty } from 'components/widgets'

const OMGProcessExitText = ({ theme, style, exitQueue, error }) => {
  const renderExitQueueIfReady = useCallback(() => {
    if (exitQueue) {
      return <OMGText style={styles.text(theme)}>{exitQueue}</OMGText>
    } else {
      return <OMGEmpty loading={true} style={styles.loading} />
    }
  }, [exitQueue, theme])

  return (
    <View style={[style]}>
      <View style={[styles.container(theme)]}>{renderExitQueueIfReady()}</View>
      <View style={styles.bottomContainer(theme)}>
        {exitQueue ? (
          <OMGText style={styles.textWhite(theme)}>
            Current Withdrawal Queue : {exitQueue}
          </OMGText>
        ) : (
          <OMGEmpty loading={true} style={styles.loading} />
        )}
      </View>
      {error && <OMGText style={styles.textError(theme)}>{error}</OMGText>}
    </View>
  )
}
const styles = StyleSheet.create({
  container: theme => ({
    borderWidth: 1,
    borderColor: theme.colors.gray4,
    padding: 12
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  bottomContainer: theme => ({
    backgroundColor: theme.colors.gray4,
    borderWidth: 1,
    borderColor: theme.colors.gray4,
    paddingHorizontal: 12,
    paddingVertical: 10
  }),
  textWhite: theme => ({
    color: theme.colors.white,
    fontSize: 12,
    letterSpacing: -0.48
  }),
  textError: theme => ({
    color: theme.colors.red,
    fontSize: 12,
    letterSpacing: -0.48,
    marginTop: 6
  }),
  loading: {
    flex: 0,
    alignItems: 'flex-start'
  }
})

export default withTheme(OMGProcessExitText)
