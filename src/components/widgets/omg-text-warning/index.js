import React from 'react'
import { View, StyleSheet } from 'react-native'
import { OMGText, OMGIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGTextWarning = ({ theme, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.iconContainer(theme)}>
        <OMGIcon name='attention' style={styles.icon(theme)} />
      </View>
      <OMGText style={styles.text(theme)}>
        You are about to move fund out of to Ethereum
        <OMGText weight='bold'> Plasma </OMGText>
        Chain to
        <OMGText weight='bold'> Ethereum </OMGText>
        Chain
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    padding: 18,
    backgroundColor: theme.colors.yellow2,
    alignItems: 'center'
  }),
  iconContainer: theme => ({
    width: 24,
    height: 24,
    backgroundColor: theme.colors.yellow,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  icon: theme => ({
    color: theme.colors.white
  }),
  text: theme => ({
    color: theme.colors.primary,
    marginLeft: 16
  })
})

export default withTheme(OMGTextWarning)
