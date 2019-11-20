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
          <OMGIcon name='chevron-right' size={24} style={styles.arrow(theme)} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  arrow: theme => ({
    color: theme.colors.white
  }),
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 44
  },

  text: theme => ({
    color: theme.colors.white
  }),
  subheader: {
    fontSize: 12,
    opacity: 0.6
  },
  header: {
    fontSize: 18
  }
})

export default withNavigation(withTheme(CardMenu))
