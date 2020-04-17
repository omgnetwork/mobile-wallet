import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  xhdpi: {
    title: {
      fontSize: 16
    },
    description: {
      fontSize: 12
    }
  },
  xxhdpi: {},
  xxxhdpi: {}
}

const defaultStyle = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: theme.colors.black3
    },
    scrollViewContainer: {
      paddingTop: 32,
      paddingBottom: 16,
      paddingHorizontal: 16
    },
    title: {
      color: theme.colors.white,
      marginTop: 16,
      fontSize: 18
    },
    description: {
      color: theme.colors.white,
      marginTop: 16
    },
    suggestionContainer: {
      flex: 1,
      flexDirection: 'column'
    },
    suggestionItem: {
      marginTop: 30
    },
    buttonContainer: {
      // justifyContent: 'flex-end'
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
