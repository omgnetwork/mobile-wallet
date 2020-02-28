import React, { useCallback } from 'react'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { OMGTextInput, OMGText, OMGEmpty } from 'components/widgets'

const OMGProcessExitInput = ({
  theme,
  inputRef,
  style,
  focusColor,
  exitQueue,
  onChangeText,
  onFocus,
  onBlur,
  error
}) => {
  const renderTextInputIfReady = useCallback(() => {
    if (exitQueue) {
      return (
        <OMGTextInput
          style={styles.text(theme)}
          placeholder={exitQueue.toString()}
          defaultValue={exitQueue.toString()}
          inputRef={inputRef}
          hideUnderline={true}
          onChangeText={onChangeText}
          keyboardType='decimal-pad'
          maxLength={6}
          selectionColor={theme.colors.primary}
          onFocus={onFocus}
          onBlur={onBlur}
          lines={1}
        />
      )
    } else {
      return <OMGEmpty loading={true} style={styles.loading} />
    }
  }, [exitQueue, inputRef, onBlur, onChangeText, onFocus, theme])

  return (
    <View style={[style]}>
      <View style={[styles.container(focusColor)]}>
        {renderTextInputIfReady()}
      </View>
      <View style={styles.blueContainer(focusColor)}>
        {exitQueue ? (
          <OMGText style={styles.textWhite(theme)}>
            Current Exit Queue : {exitQueue}
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
  container: focusColor => ({
    borderWidth: 1,
    borderColor: focusColor,
    padding: 8,
    paddingHorizontal: 12
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  blueContainer: focusColor => ({
    backgroundColor: focusColor,
    borderWidth: 1,
    borderColor: focusColor,
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

export default withTheme(OMGProcessExitInput)
