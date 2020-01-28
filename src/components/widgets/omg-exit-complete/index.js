import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGFontIcon } from 'components/widgets'
import Config from 'react-native-config'
import { withTheme } from 'react-native-paper'
import { Datetime } from 'common/utils'

const OMGExitComplete = ({ theme, style, createdAt }) => {
  const renderProcessedAt = useCallback(() => {
    const processedAt = Datetime.add(
      Datetime.fromString(createdAt),
      Config.EXIT_PERIOD * 2
    )
    return ` ${Datetime.format(processedAt, datetimeFormatToken)}. `
  }, [createdAt])

  const datetimeFormatToken = 'MMM DD, hh:mm A' // Apr 05, 12:02 PM
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGFontIcon name='time' size={24} style={styles.icon(theme)} />
      <OMGText style={styles.text(theme)}>
        Exit will be approximately completed on
        <OMGText weight='mono-bold'>{renderProcessedAt()}</OMGText>
        You can track the transaction status in the
        <OMGText weight='mono-bold'> History </OMGText>
        menu.
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    padding: 16,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.yellow4
  }),
  icon: theme => ({
    color: theme.colors.black
  }),
  text: theme => ({
    color: theme.colors.primary,
    marginLeft: 16,
    marginRight: 16
  })
})

export default withTheme(OMGExitComplete)
