import React from 'react'
import { View } from 'react-native'
import { Divider, Menu } from 'react-native-paper'

const OMGMenu = ({ visible, items, onDismiss, anchorComponent, style }) => {
  const menuItems = items.map(({ title, onPress }) => (
    <Menu.Item onPress={onPress} title={title} key={title} />
  ))

  return (
    <View>
      <Menu
        style={{ ...style }}
        visible={visible}
        onDismiss={onDismiss}
        anchor={anchorComponent}>
        {menuItems}
      </Menu>
    </View>
  )
}

export default OMGMenu
