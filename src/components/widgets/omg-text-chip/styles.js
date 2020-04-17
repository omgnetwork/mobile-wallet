import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  small: {
    text: {
      fontSize: 14
    }
  },
  medium: {
    text: {
      fontSize: 16
    }
  }
}

const defaultStyle = theme =>
  StyleSheet.create({
    container: {
      width: '30%',
      backgroundColor: theme.colors.black5,
      paddingVertical: 16,
      paddingHorizontal: 8,
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.colors.gray4
    },
    text: {
      color: theme.colors.white,
      fontSize: 18,
      letterSpacing: -0.72,
      textTransform: 'capitalize'
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
