import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  small: {
    headerText: {
      fontSize: 20,
      marginTop: 16
    },
    image: {
      marginTop: 0
    },
    headerContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16
    },
    contentContainer: {
      paddingHorizontal: 20
    },
    contentText1: {
      fontSize: 12
    },
    contentText2: {
      fontSize: 12
    }
  },
  medium: {
    headerText: {
      fontSize: 24,
      marginTop: 16
    },
    image: {
      marginTop: 0
    },
    headerContainer: {
      paddingVertical: 16
    }
  }
}

const defaultStyle = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.black5,
      flexDirection: 'column'
    },
    image: {
      marginTop: 16
    },
    headerContainer: {
      paddingHorizontal: 30,
      backgroundColor: theme.colors.black5
    },
    headerText: {
      color: theme.colors.white,
      fontSize: 30,
      marginTop: 28
    },
    contentContainer: {
      backgroundColor: theme.colors.black5,
      paddingHorizontal: 30
    },
    buttonContainer: {
      paddingHorizontal: 30,
      paddingVertical: 8,
      backgroundColor: theme.colors.black5
    },
    contentText1: {
      color: theme.colors.gray6,
      fontSize: 14,
      lineHeight: 20
    },
    contentText2: {
      color: theme.colors.gray6,
      fontSize: 14,
      marginTop: 10,
      lineHeight: 20
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.roundness
    },
    confirmButtonText: {
      color: theme.colors.white
    },
    declineButton: {
      backgroundColor: 'transparent',
      marginTop: 8
    },
    declineButtonText: {
      color: theme.colors.white
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
