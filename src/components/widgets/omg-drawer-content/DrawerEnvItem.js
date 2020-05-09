import React from 'react'
import { StyleSheet, View } from 'react-native'
import { OMGText } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

const DrawerEnvItem = ({ theme, title, value }) => {
  const styles = createStyles(theme)
  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        {title}
      </OMGText>
      <OMGText style={styles.value}>{value}</OMGText>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      marginTop: 16,
      justifyContent: 'center'
    },
    title: {
      fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
      letterSpacing: Styles.getResponsiveSize(-0.64, {
        small: -0.32,
        medium: -0.48
      }),
      color: theme.colors.gray5
    },
    value: {
      color: theme.colors.gray4,
      fontSize: 12,
      marginTop: 4,
      letterSpacing: -0.48
    }
  })

export default withTheme(DrawerEnvItem)
