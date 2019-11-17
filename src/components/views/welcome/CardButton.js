import React from 'react'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { OMGIcon, OMGText } from '../../widgets'

const CardMenu = ({ theme, color, header, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <View style={{ ...styles.container, backgroundColor: color }}>
          <View>
            <OMGText style={[styles.text(theme), styles.header]} weight='bold'>
              {header}
            </OMGText>
            <OMGText style={[styles.text(theme), styles.subheader]}>
              {description}
            </OMGText>
          </View>
          <OMGIcon name='chevron-right' size={28} style={styles.arrow(theme)} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  arrow: theme => ({
    marginRight: 20,
    color: theme.colors.white
  }),
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100
  },

  text: theme => ({
    color: theme.colors.white,
    marginLeft: 20
  }),
  subheader: {
    fontSize: 12
  },
  header: {
    fontSize: 20
  }
})

export default withNavigation(withTheme(CardMenu))
