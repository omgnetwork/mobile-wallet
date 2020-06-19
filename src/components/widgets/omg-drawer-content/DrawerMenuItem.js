import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon } from 'components/widgets'
import { Styles } from 'common/utils'
import { withTheme } from 'react-native-paper'

const DrawerMenuItem = ({
  theme,
  title,
  disabled,
  style,
  onPress,
  showCaret = true
}) => {
  const styles = createStyles(theme, disabled)
  return (
    <TouchableOpacity
      style={{ ...styles.container, ...style }}
      disabled={disabled}
      onPress={onPress}>
      <OMGText style={styles.titleLeft} weight='book'>
        {title}
      </OMGText>
      {showCaret && (
        <OMGFontIcon name='chevron-right' size={8} style={styles.iconRight} />
      )}
    </TouchableOpacity>
  )
}
const createStyles = (theme, disabled) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 16,
      alignItems: 'center',
      opacity: disabled ? 0.4 : 1.0
    },
    titleLeft: {
      flex: 1,
      fontSize: Styles.getResponsiveSize(16, { small: 14, medium: 16 }),
      color: theme.colors.black5
    },
    iconRight: { color: theme.colors.gray3 }
  })

export default withTheme(DrawerMenuItem)
