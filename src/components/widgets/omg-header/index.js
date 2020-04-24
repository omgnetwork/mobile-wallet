import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGFontIcon, OMGText } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

const OMGHeader = ({ theme, onPress, title }) => {
  return (
    <View style={styles.header}>
      <OMGFontIcon
        name='chevron-left'
        size={Styles.getResponsiveSize(18, { small: 14, medium: 16 })}
        color={theme.colors.white}
        style={styles.headerIcon}
        onPress={onPress}
      />
      <OMGText style={styles.headerTitle(theme)}>{title}</OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16
  },
  headerIcon: {
    padding: 8,
    marginLeft: -8
  },
  headerTitle: theme => ({
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    paddingVertical: 16,
    color: theme.colors.white,
    marginLeft: 8,
    textTransform: 'uppercase'
  })
})

export default withTheme(OMGHeader)
