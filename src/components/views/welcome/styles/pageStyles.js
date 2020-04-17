import { Dimensions, StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  small: {
    header: {
      fontSize: 20
    },
    subheader: {
      fontSize: 16
    }
  },
  medium: {
    header: {
      fontSize: 20
    },
    subheader: {
      fontSize: 18
    }
  }
}

const defaultStyle = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-evenly',
      width: Dimensions.get('window').width,
      paddingHorizontal: 30,
      marginBottom: 16
    },
    text: {
      color: theme.colors.white,
      textAlign: 'left'
    },
    image: {},
    textContent: {},
    subheader: {
      fontSize: 18,
      opacity: 0.6,
      lineHeight: 25,
      marginTop: 10
    },
    header: {
      fontSize: 30
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
