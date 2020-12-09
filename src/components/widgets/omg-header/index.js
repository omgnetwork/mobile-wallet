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
        size={18}
        color={theme.colors.white}
        style={styles.headerIcon}
        onPress={onPress}
      />
      <OMGText style={styles.title(theme)}>{title}</OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Styles.getResponsiveSize(16, { small: 8, medium: 8 }),
    paddingVertical: Styles.getResponsiveSize(24, { small: 24, medium: 24 })
  },
  title: theme => ({
    flex: 1,
    marginHorizontal: 16,
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    textTransform: 'uppercase',
    color: theme.colors.white
  }),
  headerIcon: {
    padding: 8
  }
})

export default withTheme(OMGHeader)
