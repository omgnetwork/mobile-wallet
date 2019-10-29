import React from 'react'
import { Modal, StyleSheet, Text, View } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGModal = ({
  theme,
  type = 'triangle-down',
  arrowX = 0,
  height = 100,
  width = 100,
  content
}) => {
  return (
    <View>
      <Modal animationType='slide' transparent={false}>
        <View style={styles.popup}>
          {type === 'triangle-up' ? (
            <View style={[styles.triangleUp(theme), { left: arrowX }]} />
          ) : null}
          <View
            children={content}
            style={[styles.square(theme), { height: height, width: width }]}
          />
          {type === 'triangle-down' ? (
            <View style={[styles.triangleDown(theme), { left: arrowX }]} />
          ) : null}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  popup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  square: theme => ({
    backgroundColor: theme.colors.blue2,
    borderRadius: 10
  }),
  triangleUp: theme => ({
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderTopWidth: 13,
    borderRightWidth: 26,
    borderRightColor: theme.colors.blue2
  }),
  triangleDown: theme => ({
    width: 0,
    height: 0,
    borderBottomColor: 'transparent',
    borderBottomWidth: 12,
    borderLeftWidth: 15,
    borderLeftColor: theme.colors.blue2
  })
})

export default withTheme(OMGModal)
