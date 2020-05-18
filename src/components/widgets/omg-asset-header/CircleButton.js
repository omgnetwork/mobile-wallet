import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText } from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CircleButton = ({ children, theme, style, label, onPress, disable }) => {
  const styles = createStyles(theme)
  return (
    <View style={[styles.container(disable), style]}>
      <TouchableOpacity
        style={[styles.btnContainer]}
        onPress={onPress}
        disabled={disable}>
        {children}
      </TouchableOpacity>
      <OMGText weight='book' style={styles.label}>
        {label}
      </OMGText>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: disable => ({
      opacity: disable ? 0.3 : 1.0
    }),
    btnContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.white,
      borderWidth: 1
    },
    label: {
      marginTop: 8,
      color: theme.colors.white,
      fontSize: 12,
      textAlign: 'center'
    }
  })

export default withTheme(CircleButton)
