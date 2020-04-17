import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  xhdpi: {
    text: {
      fontSize: 12
    }
  },
  xxhdpi: {
    text: {
      fontSize: 14
    }
  },
  xxxhdpi: {}
}

const defaultStyle = theme =>
  StyleSheet.create({
    icon: {
      marginRight: 8,
      width: 16,
      height: 16
    },
    text: {
      color: theme.colors.black2,
      textAlign: 'center',
      fontSize: 16,
      textTransform: 'uppercase'
    },
    container: {
      justifyContent: 'center',
      backgroundColor: theme.colors.white,
      alignSelf: 'center',
      width: '100%',
      paddingHorizontal: 8,
      paddingVertical: 12,
      flexDirection: 'row'
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    inactive: {
      opacity: 0.5
    },
    active: {
      opacity: 1.0
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
