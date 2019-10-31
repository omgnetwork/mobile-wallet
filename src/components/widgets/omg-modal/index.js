import React from 'react'
import { Modal, StyleSheet, View, Text } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGModal = ({
  theme,
  type,
  arrowX = -50,
  modalVisible,
  height,
  width,
  content = (
    <View>
      <Text>Hello</Text>
    </View>
  ),
  style
}) => {
  return (
    <View>
      <Modal animationType='slide' transparent={true} visible={modalVisible}>
        <View style={[styles.popup, style]}>
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
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.blue2
  }),
  triangleDown: theme => ({
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.blue2,
    transform: [{ rotate: '180deg' }]
  })
})

export default withTheme(OMGModal)
