import React from 'react'
import { View } from 'react-native'
import { Divider, Menu } from 'react-native-paper'

const OMGMenu = ({ visible, items, onDismiss, anchorComponent, style }) => {
  const menuItems = items.map(({ title, onPress }) => (
    <Menu.Item
      onPress={onPress}
      title={title}
      key={title}
      style={{ flex: 1 }}
    />
  ))

  return (
    <View style={{ flex: 1 }}>
      <Menu
        style={{ ...style }}
        visible={visible}
        onDismiss={onDismiss}
        anchor={anchorComponent}
        contentStyle={{
          ...style,
          flex: 1
        }}>
        {menuItems}
      </Menu>
    </View>
  )
}

export default OMGMenu
