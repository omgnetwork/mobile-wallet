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
      fontSize: 12
    }
  },
  medium: {
    image: {
      marginTop: 16
    },
    title: {
      marginTop: 16,
      fontSize: 16
    }
  }
}

const defaultStyle = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.black3
    },
    contentContainer: {
      paddingHorizontal: 16
    },
    image: {
      marginTop: 32
    },
    title: {
      color: theme.colors.white,
      marginTop: 30,
      fontSize: 18
    },
    description: {
      color: theme.colors.white,
      marginTop: 16
    },
    confirmBox: {
      marginTop: 16
    },
    mnemonicContainer: {
      flex: 1,
      marginTop: 8,
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    buttonContainer: {
      justifyContent: 'flex-end',
      marginTop: 16,
      marginBottom: 16
    },
    chip: {
      marginRight: 8,
      borderWidth: 1
    }
  })

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
