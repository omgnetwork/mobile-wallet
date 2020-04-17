import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  small: {
    headerTitle: {
      fontSize: 14
    }
  },
  medium: {
    headerTitle: {
      fontSize: 16
    }
  }
}

const defaultStyle = theme =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 16
    },
    headerIcon: {
      padding: 8,
      marginLeft: -8
    },
    headerTitle: {
      fontSize: 18,
      paddingVertical: 16,
      color: theme.colors.white,
      marginLeft: 8,
      textTransform: 'uppercase'
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
