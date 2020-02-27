import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGFontIcon } from 'components/widgets'
import Config from 'react-native-config'
import { withTheme } from 'react-native-paper'
import { Datetime } from 'common/utils'
import { BlockchainDataFormatter } from 'common/blockchain'

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
      <OMGFontIcon name='time' size={30} style={styles.icon(theme)} />
      <OMGText style={styles.text(theme)}>
        Exit will be approximately completed on
        <OMGText weight='mono-semi-bold'>{renderProcessedAt()}</OMGText>
        You can track the exit status in the
        <OMGText weight='mono-semi-bold'> History </OMGText>
        menu.
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.gray5
  }),
  icon: theme => ({
    color: theme.colors.blue
  }),
  text: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    lineHeight: 18,
    color: theme.colors.white,
    marginLeft: 16,
    marginRight: 24
  })
})

export default withTheme(OMGExitComplete)
