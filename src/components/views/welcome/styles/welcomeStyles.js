import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  small: {
    logo: {
      width: 78,
      height: 26.4
    }
  },
  medium: {
    logo: {
      width: 104,
      height: 35.2
    }
  }
}

const defaultStyle = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.colors.black,
      justifyContent: 'space-around'
    },
    logo: {
      width: 130,
      height: 44,
      marginTop: 16,
      marginLeft: 30
    },
    cardMenu: {
      flex: 3
    },
    scroll: {
      flex: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 20
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
