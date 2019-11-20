import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGText from '../omg-text'
import * as EmptyImages from './assets'

const OMGEmpty = ({ text, loading, style, textStyle, imageName, theme }) => {
  const EmptyImage = EmptyImages[imageName]
  console.log(text)
  return (
    <View style={{ ...styles.container, ...style }}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ ...styles.container, ...style }}>
          {imageName && EmptyImage && <EmptyImage />}
          <OMGText style={[styles.emptyText(theme), textStyle]}>{text}</OMGText>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: theme => ({
    color: theme.colors.gray2,
    textAlign: 'center',
    marginTop: 14
  })
})

export default withTheme(OMGEmpty)
