import React, { useRef, Fragment, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, withTheme, Divider } from 'react-native-paper'
import { OMGBackground, OMGIcon } from 'components/widgets'

const OMGCardAssets = ({ theme, style, children }) => {
  return (
    <OMGBackground style={{ ...styles.container, ...style }}>
      <View style={styles.header}>
        <Text style={styles.title(theme)}>Assets</Text>
        <OMGIcon name='plus' color={theme.colors.icon} style={styles.add} />
      </View>
      <Divider inset={false} />
      <View>{children}</View>
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    padding: 16
  },
  add: {
    justifyContent: 'flex-end'
  },
  title: theme => ({
    flex: 1,
    textAlign: 'left',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    color: theme.colors.darkText3,
    fontSize: 14
  })
})

export default withTheme(OMGCardAssets)
