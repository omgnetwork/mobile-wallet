import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  xhdpi: {
    modal: {
      marginBottom: 16
    },
    contentContainer: {
      padding: 16,
      paddingHorizontal: 20
    },
    textTitle: {
      marginTop: 16,
      fontSize: 18
    },
    image: {
      marginTop: 30
    },
    textContent: {
      marginTop: 10,
      fontSize: 14,
      marginHorizontal: 30
    },
    leftButtonText: {
      fontSize: 12
    },
    rightButtonText: {
      fontSize: 12
    },
    buttonContainer: {
      marginTop: 24
    }
  },
  xxhdpi: {
    modal: {
      marginBottom: 16
    },
    contentContainer: {
      padding: 16,
      paddingHorizontal: 20
    },
    textTitle: {
      marginTop: 24,
      fontSize: 20
    },
    image: {
      marginTop: 30
    },
    textContent: {
      marginTop: 10,
      fontSize: 14,
      marginHorizontal: 30
    },
    buttonContainer: {
      marginTop: 40
    }
  },
  xxxhdpi: {
    modal: {
      marginBottom: 16
    },
    contentContainer: {
      padding: 16,
      paddingHorizontal: 20
    },
    textTitle: {
      marginTop: 24,
      fontSize: 20
    },
    image: {
      marginTop: 30
    },
    textContent: {
      marginTop: 10,
      fontSize: 14,
      marginHorizontal: 30
    },
    leftButtonText: {
      fontSize: 12
    },
    rightButtonText: {
      fontSize: 12
    }
  }
}

const defaultStyle = theme =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'column'
    },
    modal: {
      justifyContent: 'flex-end'
    },
    contentContainer: {
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: theme.colors.white,
      borderRadius: theme.roundness
    },
    textTitle: {
      color: theme.colors.black5
    },
    textContent: {
      color: theme.colors.gray5,
      textAlign: 'left'
    },
    buttonContainer: {
      marginTop: 40,
      flexDirection: 'row'
    },
    leftButton: {
      flex: 1,
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.black5,
      borderWidth: 1
    },
    leftButtonText: {
      color: theme.colors.black4
    },
    rightButton: {
      backgroundColor: theme.colors.primary,
      flex: 1,
      marginLeft: 16
    },
    rightButtonText: {
      color: theme.colors.white
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
