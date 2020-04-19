import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  small: {
    image: {
      marginTop: 16
    },
    title: {
      marginTop: 16,
      fontSize: 16
    },
    description: {
      marginTop: 8,
      fontSize: 12
    },
    mnemonicContainer: {
      marginTop: 8
    }
  },
  medium: {
    mnemonicContainer: {
      marginTop: 16
    },
    title: {
      marginTop: 12
    },
    description: {
      marginTop: 12
    },
    image: {
      marginTop: 16
    }
  }
}

const defaultStyle = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: theme.colors.black3
    },
    scrollView: {
      paddingBottom: 16
    },
    image: {
      marginTop: 32
    },
    title: {
      color: theme.colors.white,
      marginTop: 30,
      fontSize: 24
    },
    description: {
      color: theme.colors.gray,
      marginTop: 16,
      fontSize: 16
    },
    mnemonicContainer: {
      flex: 1,
      marginTop: 24,
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    buttonContainer: {
      marginBottom: 8
    },
    chip: {
      marginRight: 8
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)