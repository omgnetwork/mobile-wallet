import React, { useCallback } from 'react'
import { View } from 'react-native'
import { OMGFontIcon, OMGText } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'
import omgHeaderStyles from './styles'

const OMGHeader = ({ theme, onPress, title }) => {
  const styles = omgHeaderStyles(theme)

  const iconSize = useCallback(() => {
    const ratio = Styles.getScreenRatio()
    if (ratio > 3) {
      return 18
    } else if (ratio > 2) {
      return 16
    } else {
      return 14
    }
  }, [])

  return (
    <View style={styles.header}>
      <OMGFontIcon
        name='chevron-left'
        size={iconSize()}
        color={theme.colors.white}
        style={styles.headerIcon}
        onPress={onPress}
      />
      <OMGText style={styles.headerTitle}>{title}</OMGText>
    </View>
  )
}

export default withTheme(OMGHeader)
