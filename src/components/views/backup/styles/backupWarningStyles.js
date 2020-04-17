import { StyleSheet } from 'react-native'
import { Styles } from 'common/utils'

const responsiveStyles = {
  xhdpi: {},
  xxhdpi: {},
  xxxhdpi: {}
}

const defaultStyle = theme => StyleSheet.create({})

export default theme => Styles.combine(defaultStyle(theme), responsiveStyles)
